const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const bodyParser = require("body-parser")

const app = new express();

let sql;

app.use(bodyParser.json())

const db = new sqlite3.Database('./todos.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message)
    }

})

sql = 'CREATE TABLE IF NOT EXISTS "tasks" ' + 
        '("id"	INTEGER, "name"	VARCHAR(255) NOT NULL,'+
        '"description" TEXT NOT NULL,'+
        '"deadline" TIMESTAMP NOT NULL,' +
        '"created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'+
        '"status" VARCHAR(255) NOT NULL DEFAULT Pending,' +
        'PRIMARY KEY("id" AUTOINCREMENT)'+
        ');'
db.run(sql)


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

app.get("/api/pending", (req, res) => {
    sql = `SELECT * FROM tasks WHERE status = "Pending" ORDER BY deadline`
    db.all(sql, [], (err, data) => { // error is passed first then data 
        if(err){
            console.error(err.message)
        } else {
            res.json(data)
        }
    });
})

app.get("/api/done", (req, res) => {
    sql = `SELECT * FROM tasks WHERE status = "Done" ORDER BY deadline`
    db.all(sql, [], (err, data) => { // error is passed first then data 
        if(err){
            console.error(err.message)
        } else {
            res.json(data)
        }
    });
})

app.post("/api/delete", (req, res) => {
    sql = "DELETE FROM tasks WHERE id = ?"
    db.run(sql, [req.body.id], (err) => {
        if(err){
            console.log(err.message)
        }
    })
    res.json({"message" : "data deleted properly"})

})

app.post("/api/post/status", (req, res) => {
    sql = "UPDATE tasks SET status = ? WHERE id = ?";
    let displayStatus;
    if(req.body.status){
        displayStatus = "Done"
    }else {
        displayStatus = "Pending"
    }
    db.run(sql, [displayStatus, req.body.id], (err) => {
        if(err){
            console.log(err.message)
        }
    })
    res.json({"message" : req.body.status === true? "Task completed" : "Task pending"})
})

app.post("/api/edit/post", (req, res) => {
    sql = `UPDATE tasks SET name = ?, description = ?, deadline = ? WHERE id = ?`
    db.run(sql, [req.body.Task, req.body.Desc, req.body.Deadline, req.body.Id], (err) => {
        if(err){
            console.log(err.message)
        }
    })
    res.json({"message" : "Data edited successfully"})
})

app.post("/api/edit", (req, res) => {
    sql = `SELECT * FROM tasks WHERE id = ?`
    db.all(sql, [req.body.id], (err, data) => {
        if(err) {
            console.log(err.message)
        } else {
            res.json(data)
        }       
    })
})


app.listen(5000, ()=> {
    console.log("listenning on port 5000")
})