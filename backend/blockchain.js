const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.getHash();
    }

    getHash() {
        return SHA256(
            JSON.stringify({
                index: this.index,
                timestamp: this.timestamp,
                data: this.data,
                previousHash: this.previousHash,
                nonce: this.nonce || 0
            })
        ).toString();
    }

    mineBlock(difficulty) {
        const target = "0".repeat(difficulty);

        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }
}

class Blockchain {
    constructor(difficulty) {
        this.chain = [this.createGenesisBlock(difficulty)];
        this.difficulty = difficulty;
    }

    createGenesisBlock(difficulty) {
        const genesisBlock = new Block(0, new Date().toString(), "Genesis Block", "0");
        genesisBlock.mineBlock(difficulty);
        return genesisBlock;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.getHash()) {
                return currentBlock.index;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return previousBlock.index;
            }
        }

        return true;
    }
}

const blockchain = new Blockchain(0);

module.exports = { Block, Blockchain, blockchain }