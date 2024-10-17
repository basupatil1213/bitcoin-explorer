// // use diesel::prelude::*;
// // use diesel::sql_types::{Nullable, Numeric};
// // use crate::schema::*;
// // use chrono::NaiveDateTime;
// // use rust_decimal::Decimal;

// // #[derive(Queryable, Insertable)]
// // #[table_name = "blocks"]
// // pub struct Block {
// //     pub block_hash: String,
// //     pub block_height: i32,
// //     pub previous_block_hash: Option<String>, // Optional field
// //     pub timestamp: NaiveDateTime, // This needs to be handled correctly
// //     pub merkle_root: Option<String>, // Optional field
// //     // pub difficulty: Option<Numeric>, // Optional field
// //     pub difficulty: Option<String>,
// //     pub nonce: Option<i64>, // Optional field
// //     pub size: Option<i32>, // Optional field
// //     pub transaction_count: Option<i32>, // Optional field
// // }

// use diesel::prelude::*;
// use crate::schema::*;
// use chrono::NaiveDateTime;
// use bigdecimal::BigDecimal;
// use serde_json::Value; // For JSONB fields

// // Block model
// #[derive(Queryable, Insertable)]
// #[table_name = "blocks"]
// pub struct Block {
//     pub id: i32, // Primary key
//     pub block_hash: String, // Unique block hash
//     pub block_height: i32,
//     pub previous_block_hash: Option<String>, // Optional field
//     pub timestamp: NaiveDateTime, // Timestamp
//     pub difficulty: Option<BigDecimal>, // Optional numeric difficulty
//     pub size: Option<i32>, // Optional size of the block
//     pub transaction_count: Option<i32>, // Optional transaction count
//     pub total_fees: Option<BigDecimal>, // Optional total fees
//     pub miner: Option<String> // Optional miner's name
// }

// // Transaction model
// #[derive(Queryable, Insertable)]
// #[table_name = "transactions"]
// pub struct Transaction {
//     pub id: i32, // Primary key
//     pub transaction_hash: String, // Unique transaction hash
//     pub block_hash: String, // Foreign key to the blocks table
//     pub inputs: Value, // JSONB field for inputs
//     pub outputs: Value, // JSONB field for outputs
//     pub total_value: BigDecimal, // Total value of the transaction
//     pub fees: BigDecimal, // Fees for the transaction
//     pub confirmation_count: i32 // Number of confirmations
// }

// // Address model (Optional)
// #[derive(Queryable, Insertable)]
// #[table_name = "addresses"]
// pub struct Address {
//     pub id: i32, // Primary key
//     pub address: String, // Bitcoin address
//     pub balance: BigDecimal, // Address balance
//     pub last_transaction: Option<String> // Optional last transaction hash
// }

// // MarketData model (Off-chain data)
// #[derive(Queryable, Insertable)]
// #[table_name = "market_data"]
// pub struct MarketData {
//     pub id: i32, // Primary key
//     pub timestamp: NaiveDateTime, // Timestamp of market data
//     pub bitcoin_price_usd: BigDecimal, // Bitcoin price in USD
//     pub market_cap_usd: BigDecimal, // Market cap in USD
//     pub volume_24h_usd: BigDecimal, // 24-hour volume in USD
//     pub price_change_percentage_24h: BigDecimal // 24-hour price change percentage
// }

// // MiningData model (Off-chain mining data)
// #[derive(Queryable, Insertable)]
// #[table_name = "mining_data"]
// pub struct MiningData {
//     pub id: i32, // Primary key
//     pub timestamp: NaiveDateTime, // Timestamp of mining data
//     pub hashrate: BigDecimal, // Hashrate of the mining network
//     pub difficulty: BigDecimal, // Difficulty level
//     pub block_time: BigDecimal, // Block time in seconds
//     pub total_reward: BigDecimal // Total mining reward
// }
