import { Link } from 'react-router-dom';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';


export function TaskEnter(){

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
      fetch("/api/post", {
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

function ModifyTask({defaultTask, defaultDesc, defaultDeadline, id}){

  const newTask = useRef();
  const newDesc = useRef();
  const newDeadline = useRef();

  return(
    <div>
      <form onSubmit={(e) => {e.preventDefault()}}>
      <div id='taskNamediv' className='taskFormdata'>
            <label htmlFor='taskName'>Task Name : </label>
            <input id='taskName' type='text' ref={newTask}  autoFocus placeholder='Add Task' defaultValue={defaultTask}></input>
          </div>
          <div id="taskDescdiv" className='taskFormdata'>
            <label htmlFor='taskDesc'>Task Description : </label>
            <textarea id='modifiedtaskDesc' ref={newDesc} placeholder='Enter short Descrition' defaultValue={defaultDesc}></textarea>
          </div>
          <div id="deadlineDiv" className='taskFormdata'>
            <label htmlFor='deadline'>Deadline : </label>
            <input id='deadline' type="datetime-local" ref={newDeadline} defaultValue={defaultDeadline}></input>
          </div> 
          <div>
            <button type='reset' onClick={() => {

              let modifyObj = {
                Task : newTask.current.value,
                Desc : newDesc.current.value,
                Deadline : newDeadline.current.value.replace("T", " "),
                Id : id
              }

              fetch("/api/edit/post", {
                method: "post",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(modifyObj)
              }).then(response => response.json()).then(data => {
                document.getElementById("ModifyTaskDiv").style.display = "none";
                window.alert(data.message)
              })
            }}>Save</button>
            <button type='reset' onClick={() => {
              document.getElementById("ModifyTaskDiv").style.display = "none";
            }}>Cancel</button>
          </div> 
          </form>    
    </div>
  )
}

export function App() {

  const [tasks, settasks] = useState([{}]);

  const [modifyTasks, setmodifyTasks] = useState([{}])
  const [edit, setedit] = useState(false)

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

            {/* Edit button */}
            <button onClick={() => {
              fetch("/api/edit", {
                method: "post",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({"id" : item.id})
              }).then(response => response.json()).then(data => {
                setmodifyTasks(data);
              })
              setedit(true)
              if(document.getElementById("ModifyTaskDiv") !== null) {
                document.getElementById("ModifyTaskDiv").style.display = "block"
              }
            }}>Edit</button>

            {/* delete button */}
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
        <div id="ModifyTaskDiv" style={{display : edit? "block" : "none"}}>
        <ModifyTask defaultTask={modifyTasks[0].name} defaultDesc={modifyTasks[0].description} defaultDeadline={modifyTasks[0].deadline} id={modifyTasks[0].id}/>
        </div>
      
    </div>
  );
}

