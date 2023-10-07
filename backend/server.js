const sql = require("sqlite3").verbose();
const express = require("express");
const bodyParser = require("body-parser")

const app = new express();

app.use(bodyParser.json())

app.post("/api/post", (req, res) => {
    console.log(req.body);
    res.json({"message" : "Data recived successfully"})
})

app.listen(5000, ()=> {
    console.log("listenning on port 5000")
})