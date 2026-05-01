const CryptoJS = require('crypto-js');

// SHA-256
function sha256(data) {
    return CryptoJS.SHA256(data).toString();
}

// БАЗОВІ ТРАНЗАКЦІЇ
let transactions = [
    { from: "Alice", to: "Bob", amount: 10 },
    { from: "Bob", to: "Charlie", amount: 5 },
    { from: "Charlie", to: "David", amount: 7 },
    { from: "David", to: "Eve", amount: 3 }
];

// Хеш транзакції
function hashTx(tx) {
    return sha256(JSON.stringify(tx));
}

// MERKLE TREE
function buildMerkleTree(leaves) {
    let level = leaves.map(hashTx);
    let tree = [level];

    while (level.length > 1) {
        let nextLevel = [];

        for (let i = 0; i < level.length; i += 2) {
            if (i + 1 < level.length) {
                nextLevel.push(sha256(level[i] + level[i + 1]));
            } else {
                nextLevel.push(level[i]); // якщо непарна кількість
            }
        }

        tree.push(nextLevel);
        level = nextLevel;
    }

    return tree;
}

// BLOCK
function createBlock(transactions, prevHash, nonce = 0) {
    const tree = buildMerkleTree(transactions);
    const merkleRoot = tree[tree.length - 1][0];

    const timestamp = Date.now();

    const header = prevHash + timestamp + merkleRoot + nonce;
    const blockHash = sha256(header);

    return {
        transactions,
        tree,
        merkleRoot,
        timestamp,
        prevHash,
        nonce,
        hash: blockHash
    };
}

// СТВОРЕННЯ БЛОКУ
const prevHash = "00000000000000000000000000000000";

const block = createBlock(transactions, prevHash);

// OUTPUT
console.log("\nTRANSACTIONS");
console.log(block.transactions);

console.log("\nMERKLE TREE");
block.tree.forEach((level, i) => {
    console.log(`Level ${i}:`);
    console.log(level);
});

console.log("\nMERKLE ROOT");
console.log(block.merkleRoot);

console.log("\nBLOCK HEADER HASH");
console.log(block.hash);

// ЗМІНА ТРАНЗАКЦІЇ
console.log("\nTEST: MODIFYING TRANSACTION");

transactions[0].amount = 999;

const tamperedBlock = createBlock(transactions, prevHash);

console.log("New Merkle Root:", tamperedBlock.merkleRoot);
console.log("New Block Hash:", tamperedBlock.hash);

console.log("\nRESULT");
console.log("Merkle root changed:", block.merkleRoot !== tamperedBlock.merkleRoot);
console.log("Block hash changed:", block.hash !== tamperedBlock.hash);