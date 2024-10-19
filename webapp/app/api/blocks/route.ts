import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

// path: /api/blocks/block




// get block details
export async function getBlockDetails() {
    let blockHeight;
    try {
        await pool.connect();
        console.log(`hello`);
        
        const query = `SELECT Id, height, hash, latest_url, previous_hash, previous_url, peer_count, high_fee_per_kb, medium_fee_per_kb, low_fee_per_kb, timestamp, time FROM block_detail ORDER BY time DESC LIMIT 10`;
        blockHeight = await pool.query(query);
        console.log(`value: \n ${JSON.stringify(blockHeight.rows)}`);
    } catch (error : unknown) {
        console.log(`error:`);
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
    
    return NextResponse.json({ message: blockHeight.rows }, { status: 200 });
}




export { getBlockDetails as GET };