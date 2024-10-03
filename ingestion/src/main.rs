use tokio_postgres::NoTls;
use std::time::Duration;
use tokio::time;
use dotenv::dotenv;
use reqwest::Error as ReqwestError; // Rename to avoid conflict with tokio_postgres::Error
use serde::Deserialize;

#[derive(Deserialize)]
struct BlockCypherResponse {
    height: i32,
}

#[tokio::main]
async fn main() -> Result<(), tokio_postgres::Error> {
    dotenv().ok();
    
    // Connection string
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Connect to PostgreSQL
    let (client, connection) = tokio_postgres::connect(&database_url, NoTls).await?;
    
    // Spawn a task to manage the connection
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {}", e);
        }
    });

    // Ingest data loop
    loop {
        // Fetch block height from the Bitcoin client
        match fetch_block_height().await {
            Ok(block_height) => {
                // Insert block height into the database
                if let Err(e) = client.execute("INSERT INTO blocks (height) VALUES ($1)", &[&block_height]).await {
                    eprintln!("Error inserting block height: {}", e);
                }
            }
            Err(e) => {
                eprintln!("Error fetching block height: {}", e);
            }
        }

        // Wait for a specific interval before the next ingestion (e.g., every 10 seconds)
        time::sleep(Duration::from_secs(10)).await;
    }
}

async fn fetch_block_height() -> Result<i32, ReqwestError> {
    // The URL for the BlockCypher API
    let url = "https://api.blockcypher.com/v1/btc/main";

    // Send the request and await the response
    let response = reqwest::get(url).await?;

    // Parse the JSON response
    let data: BlockCypherResponse = response.json().await?;

    // Return the block height
    Ok(data.height)
}
