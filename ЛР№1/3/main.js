require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.ETHERSCAN_API_KEY;

// V2 endpoint
const BASE_URL = 'https://api.etherscan.io/v2/api';
const CHAIN_ID = 1; // Ethereum mainnet

// delay (для rate limit)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// отримати останній блок
async function getLatestBlockNumber() {
    const res = await axios.get(BASE_URL, {
        params: {
            module: 'proxy',
            action: 'eth_blockNumber',
            apikey: API_KEY,
            chainid: CHAIN_ID
        }
    });

    console.log("RAW RESPONSE (blockNumber):", res.data);

    if (!res.data?.result) {
        throw new Error("API error: block number not returned");
    }

    return parseInt(res.data.result, 16);
}

// отримати блок
async function getBlock(blockNumber) {
    const hex = '0x' + blockNumber.toString(16);

    const res = await axios.get(BASE_URL, {
        params: {
            module: 'proxy',
            action: 'eth_getBlockByNumber',
            tag: hex,
            boolean: true,
            apikey: API_KEY,
            chainid: CHAIN_ID
        }
    });

    console.log(`RAW RESPONSE (block ${blockNumber}):`, res.data);

    if (!res.data?.result) {
        throw new Error("API error: block data not returned");
    }

    return res.data.result;
}

// main
async function main() {
    try {
        const latest = await getLatestBlockNumber();
        console.log("\nLatest block number:", latest);

        const block = await getBlock(latest);

        const timestamp = parseInt(block.timestamp, 16);
        const date = new Date(timestamp * 1000);

        console.log("\nBlock info:");
        console.log("Number:", parseInt(block.number, 16));
        console.log("Date:", date.toLocaleString());
        console.log("Transactions:", block.transactions?.length ?? 0);
        console.log("Hash:", block.hash);
        console.log("Previous Hash:", block.parentHash);

        // середнє за 5 блоків
        let totalTx = 0;

        for (let i = 0; i < 5; i++) {
            const b = await getBlock(latest - i);
            totalTx += b.transactions?.length ?? 0;

            await sleep(400); // захист від rate limit
        }

        console.log("\nAverage transactions (last 5 blocks):", totalTx / 5);

    } catch (err) {
        console.error("\nERROR:", err.message);
    }
}

main();