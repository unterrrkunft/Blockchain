const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.timestamp +
                JSON.stringify(this.data) +
                this.previousHash +
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        const target = "0".repeat(difficulty);
        let iterations = 0;

        const startTime = Date.now();

        while (!this.hash.startsWith(target)) {
            this.nonce++;
            iterations++;
            this.hash = this.calculateHash();
        }

        const endTime = Date.now();

        console.log(`Block mined: ${this.hash}`);
        console.log(`Iterations: ${iterations}`);
        console.log(`Mining time: ${endTime - startTime} ms\n`);

        this.iterations = iterations;
    }

    // Альтернативний майнер
    mineBlockAlternative() {
        let iterations = 0;
        const startTime = Date.now();

        while (this.hash[2] !== '3') {
            this.nonce++;
            iterations++;
            this.hash = this.calculateHash();
        }

        const endTime = Date.now();

        console.log(`Alt mined: ${this.hash}`);
        console.log(`Iterations: ${iterations}`);
        console.log(`Mining time: ${endTime - startTime} ms\n`);

        this.iterations = iterations;
    }
}

module.exports = Block;