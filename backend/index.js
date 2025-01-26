const express = require("express");
const cors = require("cors");
const router = require("./routes.js");

const PORT = 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use(router);

app.listen(PORT, () => {
    console.log("Blockchain app is running on PORT: " + PORT)
})