// @generated automatically by Diesel CLI.

diesel::table! {
    addresses (id) {
        id -> Int4,
        #[max_length = 100]
        address -> Varchar,
        balance -> Nullable<Numeric>,
        #[max_length = 64]
        last_transaction -> Nullable<Varchar>,
    }
}

diesel::table! {
    blocks (id) {
        id -> Int4,
        block_height -> Int4,
        block_hash -> Varchar,
        previous_block_hash -> Nullable<Varchar>,
        timestamp -> Timestamp,
        difficulty -> Nullable<Numeric>,
        size -> Nullable<Int4>,
        transaction_count -> Nullable<Int4>,
        total_fees -> Nullable<Numeric>,
        #[max_length = 100]
        miner -> Nullable<Varchar>,
    }
}

diesel::table! {
    market_data (id) {
        id -> Int4,
        timestamp -> Timestamp,
        bitcoin_price_usd -> Nullable<Numeric>,
        market_cap_usd -> Nullable<Numeric>,
        volume_24h_usd -> Nullable<Numeric>,
        price_change_percentage_24h -> Nullable<Numeric>,
    }
}

diesel::table! {
    mining_data (id) {
        id -> Int4,
        timestamp -> Timestamp,
        hashrate -> Nullable<Numeric>,
        difficulty -> Nullable<Numeric>,
        block_time -> Nullable<Numeric>,
        total_reward -> Nullable<Numeric>,
    }
}

diesel::table! {
    transactions (id) {
        id -> Int4,
        #[max_length = 64]
        transaction_hash -> Varchar,
        #[max_length = 64]
        block_hash -> Nullable<Varchar>,
        inputs -> Jsonb,
        outputs -> Jsonb,
        total_value -> Nullable<Numeric>,
        fees -> Nullable<Numeric>,
        confirmation_count -> Nullable<Int4>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    addresses,
    blocks,
    market_data,
    mining_data,
    transactions,
);
