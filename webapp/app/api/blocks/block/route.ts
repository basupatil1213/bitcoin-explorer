import pool from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

// path: /api/blocks/block




// get block details
export async function GET(req: NextRequest) {
    // Use query parameters to get the hash
    const url = new URL(req.url); // Changed from req.body to req.query

    const hash = url.searchParams.get('hash');
    console.log(`hash: ${hash}`);

    if (!hash) // Check if hash is undefined or null
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    try {
        const result = await pool.query(
            'SELECT * FROM block_detail WHERE hash = $1',
            [hash]
        );
        console.log(JSON.stringify(result));
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Block not found' }, { status: 404 });
        }
        return NextResponse.json({ data: result.rows[0]}, { status: 200 });
    } catch (error) {
        console.error('Error querying block details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
