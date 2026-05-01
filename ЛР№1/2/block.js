const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '', validator) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.validator = validator; // хто створив блок
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
                this.validator.name // додаємо валідатора
            )
            .digest('hex');
    }
}

module.exports = Block;