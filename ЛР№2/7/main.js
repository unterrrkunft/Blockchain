const crypto = require('crypto');

// HASH FUNCTION
function hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// TRANSACTIONS
const transactions = [
    { from: 'Alice', to: 'Bob', amount: 10 },
    { from: 'Bob', to: 'Charlie', amount: 5 },
    { from: 'Charlie', to: 'David', amount: 7 },
    { from: 'David', to: 'Eve', amount: 3 }
];

// BUILD MERKLE TREE
function buildMerkleTree(txs) {
    let level = txs.map(tx => hash(JSON.stringify(tx)));
    const levels = [level];

    while (level.length > 1) {
        const nextLevel = [];

        for (let i = 0; i < level.length; i += 2) {
            if (i + 1 < level.length) {
                nextLevel.push(hash(level[i] + level[i + 1]));
            } else {
                nextLevel.push(level[i]); // if odd
            }
        }

        level = nextLevel;
        levels.push(level);
    }

    return levels;
}

const levels = buildMerkleTree(transactions);
const merkleRoot = levels[levels.length - 1][0];

// GET MERKLE PROOF
function getMerkleProof(levels, index) {
    const proof = [];

    for (let i = 0; i < levels.length - 1; i++) {
        const level = levels[i];

        const isRightNode = index % 2;
        const pairIndex = isRightNode ? index - 1 : index + 1;

        if (pairIndex < level.length) {
            proof.push({
                data: level[pairIndex],
                position: isRightNode ? 'left' : 'right'
            });
        }

        index = Math.floor(index / 2);
    }

    return proof;
}

// VERIFY PROOF
function verifyProof(txHash, proof, merkleRoot) {
    let computedHash = txHash;

    for (const step of proof) {
        if (step.position === 'left') {
            computedHash = hash(step.data + computedHash);
        } else {
            computedHash = hash(computedHash + step.data);
        }
    }

    return computedHash === merkleRoot;
}

// DEMO
console.log("\nTRANSACTIONS:");
console.log(transactions);

console.log("\nMERKLE ROOT:");
console.log(merkleRoot);

// беремо першу транзакцію
const txIndex = 0;
const txHash = hash(JSON.stringify(transactions[txIndex]));

// proof для неї
const proof = getMerkleProof(levels, txIndex);

console.log("\nTX HASH:");
console.log(txHash);

console.log("\nMERKLE PROOF:");
console.log(proof);

// перевірка
const result = verifyProof(txHash, proof, merkleRoot);

console.log("\nVERIFICATION RESULT:");
console.log(result ? "VALID" : "INVALID");

// TEST: MODIFY TX
console.log("\nTEST: MODIFYING TRANSACTION");

const fakeTxHash = hash(JSON.stringify({ from: 'Alice', to: 'Bob', amount: 999 }));

const fakeResult = verifyProof(fakeTxHash, proof, merkleRoot);

console.log("Fake verification:", fakeResult ? "VALID" : "INVALID");