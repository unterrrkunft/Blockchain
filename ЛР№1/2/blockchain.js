const Block = require('./block');

class Blockchain {
    constructor(validators) {
        this.chain = [this.createGenesisBlock()];
        this.validators = validators; // список валідаторів
    }

    createGenesisBlock() {
        return new Block(
            0,
            new Date().toISOString(),
            "Genesis Block",
            "0",
            { name: "System" } // фейковий валідатор
        );
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Вибір валідатора пропорційно stake
    selectValidator() {
        const totalStake = this.validators.reduce((sum, v) => sum + v.stake, 0);
        let random = Math.random() * totalStake;

        for (let validator of this.validators) {
            random -= validator.stake;
            if (random < 0) {
                return validator;
            }
        }
    }

    addBlock(data) {
        const validator = this.selectValidator();

        const newBlock = new Block(
            this.chain.length,
            new Date().toISOString(),
            data,
            this.getLatestBlock().hash,
            validator
        );

        console.log(
            `Block ${newBlock.index} validated by ${validator.name} (stake = ${validator.stake})`
        );

        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // перевірка хешу
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // перевірка зв’язку
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;