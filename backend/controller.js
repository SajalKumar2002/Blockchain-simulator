const {
    Block,
    blockchain
} = require("./blockchain.js");

const getChain = (req, res) => {
    res.send(blockchain.chain);
}

const addBlock = (req, res) => {
    const { data } = req.body;
    const newBlock = new Block(
        blockchain.getLatestBlock().index + 1, // blockchain.length
        new Date().toString(),
        data,
        blockchain.getLatestBlock().hash
    );

    newBlock.mineBlock(0);

    blockchain.addBlock(newBlock);

    res.send(
        {
            message: "Block added successfully",
            block: newBlock
        }
    )
}

const validateChain = (req, res) => {
    const validChain = blockchain.isChainValid();

    if (validChain === true) {
        res.send({ validChain }).status(200);
    } else {
        res.send({ validChain: false, index: validChain }).status(200);
    }
}

const tamperBlock = (req, res) => {
    const { index } = req.params;


    if (index < 0 || index >= blockchain.chain.length) {
        return res.status(404).send("Block not found");
    }

    try {
        blockchain.chain[index].data = "Tampered data";
        blockchain.chain[index].hash = blockchain.chain[index].getHash();

        res.send("Block tampered successfully");
    } catch (error) {
        res.status(500).send("Error tampering block");
        console.log(error);
    }
}

module.exports = {
    getChain,
    addBlock,
    validateChain,
    tamperBlock
}