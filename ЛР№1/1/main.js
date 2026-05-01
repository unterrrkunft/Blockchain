const Blockchain = require('./blockchain');

const myCoin = new Blockchain();

console.log("Mining block 1...");
myCoin.addBlock("Block 1 Data");

console.log("Mining block 2...");
myCoin.addBlock("Block 2 Data");

console.log("Mining block 3...");
myCoin.addBlock("Block 3 Data");

console.log("\nBlockchain valid:", myCoin.isChainValid());

// Ламаємо блок
console.log("\nTampering with block 2...");
myCoin.chain[1].data = "Hacked!";

console.log("Blockchain valid after tampering:", myCoin.isChainValid());