const express = require('express')
const router = express.Router()

const {
    getChain,
    addBlock,
    validateChain,
    tamperBlock
} = require("./controller.js");

router
    .get("/blockchain", getChain)
    .post("/blockchain/add", addBlock)
    .get("/blockchain/validate", validateChain)
    .put("/blockchain/tamper/:index", tamperBlock)

module.exports = router;