const Blockchain = require('./blockchain');
const Validator = require('./validator');

// Створюємо валідаторів
const validators = [
    new Validator("Alice", 5),
    new Validator("Bob", 10),
    new Validator("Charlie", 1)
];

// Створюємо блокчейн
const myChain = new Blockchain(validators);

// Додаємо блоки
console.log("Adding blocks...\n");

for (let i = 1; i <= 5; i++) {
    myChain.addBlock(`Block ${i} data`);
}

// Перевірка
console.log("\nBlockchain valid:", myChain.isChainValid());

// Злом
console.log("\nTampering with block 2...");
myChain.chain[1].data = "Hacked!";

console.log("Blockchain valid after tampering:", myChain.isChainValid());


// Статистика вибору валідаторів
const stats = {
    Alice: 0,
    Bob: 0,
    Charlie: 0
};

const testChain = new Blockchain(validators);

for (let i = 0; i < 100; i++) {
    const validator = testChain.selectValidator();
    stats[validator.name]++;
}

console.log("\nValidator selection stats (100 runs):");
console.log(stats);