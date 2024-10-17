use postgres::{Client, NoTls};
use serde::{Deserialize, Serialize};
use std::process::Command;
use tokio::time::{sleep, Duration};
use std::env;
use tokio::process::Command as TokioCommand; // async command

const SLEEP_INTERVAL_SECS: u64 = 240; // seconds

#[derive(Debug, Serialize, Deserialize)]
struct BlockData {
    hash: String,
    confirmations: u32,
    size: u32,
    height: u32,
    version: u32,
    time: i64,
    // n_tx: u32,
    // tx: Vec<String>,  // List of transaction IDs (txids)
}

#[derive(Debug, Serialize, Deserialize)]
struct TransactionData {
    txid: String,
    size: u32,
    version: u32,
    locktime: i64,
}

async fn get_latest_block() -> Result<BlockData, Box<dyn std::error::Error>> {
    let block_count_output = TokioCommand::new("bitcoin-cli")
        .arg("getblockcount")
        .output()
        .await?
        .stdout;

    let block_count_str = String::from_utf8(block_count_output)?.trim().to_string();
    let block_count: u32 = block_count_str.parse()?;

    let block_hash_output = TokioCommand::new("bitcoin-cli")
        .arg("getblockhash")
        .arg(block_count.to_string())
        .output()
        .await?
        .stdout;

    let block_hash = String::from_utf8(block_hash_output)?.trim().to_string();

    let block_data_output = TokioCommand::new("bitcoin-cli")
        .arg("getblock")
        .arg(block_hash.clone())
        .arg("2")  // Verbose block data
        .output()
        .await?
        .stdout;

    let block_data_json = String::from_utf8(block_data_output)?;
    let block_data: BlockData = serde_json::from_str(&block_data_json)?;

    Ok(block_data)
}

async fn get_transaction(txid: &str) -> Result<TransactionData, Box<dyn std::error::Error>> {
    let tx_data_output = TokioCommand::new("bitcoin-cli")
        .arg("getrawtransaction")
        .arg(txid)
        .arg("true")  // This returns the decoded transaction data
        .output()
        .await?
        .stdout;

    let tx_data_json = String::from_utf8(tx_data_output)?;
    let tx_data: TransactionData = serde_json::from_str(&tx_data_json)?;

    Ok(tx_data)
}

async fn insert_block_and_transactions_into_db(block_data: &BlockData) -> Result<(), Box<dyn std::error::Error>> {
    let postgress_url = "postgres://postgres:postgres@localhost:5432/crypto_explorer";
    let (client, connection) = tokio_postgres::connect(postgress_url, NoTls).await?;

    // Spawn a new task to handle the connection
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {}", e);
        }
    });

    // Insert block data
    client.execute(
        "INSERT INTO blocks (hash, confirmations, size, height, version, time) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (hash) DO NOTHING",
         &[
            &block_data.hash,
            &(block_data.confirmations as i32), // Convert u32 to i32
            &(block_data.size as i32),          // Convert u32 to i32
            &(block_data.height as i32),        // Convert u32 to i32
            &(block_data.version as i32),       // Convert u32 to i32
            &block_data.time,                   // Keep time as is (i64)
        ],
    ).await?;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    loop {
        // Fetch the latest block data
        match get_latest_block().await {
            Ok(latest_block_data) => {
                // Insert block and associated transactions into the database
                if let Err(e) = insert_block_and_transactions_into_db(&latest_block_data).await {
                    eprintln!("Failed to insert block or transactions: {}", e);
                } else {
                    println!("Inserted block and transactions: {:?}", latest_block_data);
                }
            }
            Err(e) => eprintln!("Failed to get block data: {}", e),
        }

        // Sleep for 4 minutes
        sleep(Duration::from_secs(SLEEP_INTERVAL_SECS)).await;
    }
}
