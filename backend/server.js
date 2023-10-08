const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const bodyParser = require("body-parser")

const app = new express();

let sql;

app.use(bodyParser.json())

const db = new sqlite3.Database("./todolist.db", sqlite3.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message)
    }
})

function insertRow(name, description, deadline){
    sql = `INSERT INTO tasks(name, description, deadline) VALUES (?, ?, ?)`
    db.run(sql, [name, description, deadline], (err) => {
        if(err){
            console.error(err.message)
        }
    });
}

app.post("/api/post", (req, res) => {
    insertRow(req.body.Task, req.body.TaskDesc, req.body.Deadline)
    res.json({"message" : "Data recived successfully"})
})






app.listen(5000, ()=> {
    console.log("listenning on port 5000")
})