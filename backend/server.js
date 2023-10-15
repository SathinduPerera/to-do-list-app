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

app.get("/api", (req, res) => {
    sql = `SELECT * FROM tasks`
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