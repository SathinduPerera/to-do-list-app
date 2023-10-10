import { Link } from 'react-router-dom';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';


export function TaskEnter({defaultTask, defaultDesc, defaultDeadline, postLocation}){

  const task = useRef()
  const taskDesc = useRef()
  const deadline = useRef()
  
  function addtask(){
    let taskObj = {
      Task : task.current.value,
      TaskDesc: taskDesc.current.value,
      Deadline: deadline.current.value.replace("T", " ")
    }

    if(taskObj.Task !== "" && taskObj.Deadline !== ""){   
      fetch(postLocation, {
        method: "post", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(taskObj)
      }).then((response) => response.json()).then((data) => {console.log(data.message)})
    }else{
      alert("Please Fill the task form completely")
    }
    
  }

  return (
    <div>
      <div>

      </div>
      <div id='formDiv'>
        <h1>Add Task</h1>
        <form onSubmit={(e) => {e.preventDefault()}}>
          <div id='taskNamediv' className='taskFormdata'>
            <label htmlFor='taskName'>Task Name : </label>
            <input id='taskName' type='text' ref={task} defaultValue={""} autoFocus placeholder='Add Task'></input>
          </div>
          <div id="taskDescdiv" className='taskFormdata'>
            <label htmlFor='taskDesc' defaultValue>Task Description : </label>
            <textarea id='taskDesc' ref={taskDesc} defaultValue={""} placeholder='Enter short Descrition'></textarea>
          </div>
          <div id="deadlineDiv" className='taskFormdata'>
            <label htmlFor='deadline'>Deadline : </label>
            <input id='deadline' type="datetime-local" ref={deadline} defaultValue={""}></input>
          </div>
            <div id="deadlineDiv" className='taskFormdata'>
            <button onClick={addtask}>Add task</button>
            <button onClick={addtask}>Add another task</button>
            <Link to={"/"}><button>Back to home</button></Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModifyTask({defaultTask, defaultDesc, defaultDeadline}){

  const newTask = useRef();
  const newDesc = useRef();
  const newDeadline = useRef();

  return(
    <div>
      <div id='taskNamediv' className='taskFormdata'>
            <label htmlFor='taskName'>Task Name : </label>
            <input id='taskName' type='text' ref={newTask} defaultValue={defaultTask} autoFocus placeholder='Add Task'></input>
          </div>
          <div id="taskDescdiv" className='taskFormdata'>
            <label htmlFor='taskDesc' defaultValue>Task Description : </label>
            <textarea id='taskDesc' ref={newDesc} defaultValue={defaultDesc} placeholder='Enter short Descrition'></textarea>
          </div>
          <div id="deadlineDiv" className='taskFormdata'>
            <label htmlFor='deadline'>Deadline : </label>
            <input id='deadline' type="datetime-local" ref={newDeadline} defaultValue={defaultDeadline}></input>
          </div> 
          <div>
            <button>Save</button>
          </div>     
    </div>
  )
}

export function App() {

  const [tasks, settasks] = useState([{}]);

  const [modifyTasks, setmodifyTasks] = useState([{}])

  function fetchTasks() {
    fetch("/api").then(response => response.json()).then(data => {
      settasks(data)
      })
  }

  useEffect(() => {
    fetchTasks()
  }, [])



  return (
    <div className="App">
      <div id="detail_bar">
        <Link to={"/AddTask"}><button>Add task</button></Link>
      </div>
      <div>
        <ol>
        {typeof tasks === "undefined"? <p>No tasks</p> : 
        tasks.map((item, index) => (
          <li key={index}>{item.name} - {item.description === ""? "No Description" : item.description} - {item.deadline} - {item.status} 
            <span id='taskControls'><input type='checkbox'/>
            <button onClick={() => {
              console.log(item.name)
              fetch("/api/edit", {
                method: "post",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({"id" : item.id})
              }).then(response => response.json()).then(data => {
                setmodifyTasks(data)
                console.log(modifyTasks[0].name)
              })
            }}>Edit</button>
            <button onClick={() => {
              if(window.confirm('Do you want to delete')){
                fetch("/api/delete", {
                  method: "post",
                  headers: {"Content-Type" : "application/json"},
                  body: JSON.stringify({"id": item.id})
                }).then(response => response.json()).then(data => console.log(data.message))
                fetchTasks();
              } else {
                window.alert("Task not deleted")
              }
            }}>Delete</button></span>
          </li>
        ))}
        </ol>
      </div>
      <div id="ModifyTaskDiv">
        <ModifyTask defaultTask={modifyTasks[0].name} defaultDesc={modifyTasks[0].description} defaultDeadline={modifyTasks[0].deadline}/>
      </div>
      
    </div>
  );
}

