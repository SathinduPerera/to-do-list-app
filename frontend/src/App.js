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

      POSTFunction("/api/post", taskObj, (data) => {
        console.log(data.message)
      })
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
            <button id='addtaskbutton' onClick={() => {
                  if(task.current.value !== "" && deadline.current.value !== ""){  
                    addtask();
                    document.getElementById('addtaskbutton').style.display = "none";
                    document.getElementById('taskresetbutton').style.display = "inline";
                  }else{
                    alert("Please Fill the task form completely")
                  }
              }} >Add task</button>
            <button type='reset' id='taskresetbutton' onClick={() => {
              document.getElementById('addtaskbutton').style.display = "inline";
              document.getElementById('taskresetbutton').style.display = "none";
            }}>Add another task</button>
            <Link to={"/"}><button>Back to home</button></Link>
          </div>
        </form>
      </div>
    </div>
  )
}

// function for post commamd
function POSTFunction(location, body, responseFunction){
  fetch(location, {
    method: "post",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(body)
  }).then(response => response.json()).then(data => {responseFunction(data)})
}


export function App() {

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
              <label htmlFor='modifiedtaskDesc'>Task Description : </label>
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

                POSTFunction("/api/edit/post", modifyObj, (data) => {
                  document.getElementById("ModifyTaskDiv").style.display = "none";
                  window.alert(data.message)
                })
  
                fetchTasks();
              }}>Save</button>
              <button type='reset' onClick={() => {
                document.getElementById("ModifyTaskDiv").style.display = "none";
              }}>Cancel</button>
            </div> 
            </form>    
      </div>
    )
  }

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
  
  useEffect(() => {
    tasks.forEach((element) => {
      if(Date.parse(element.deadline) - Date.now() <= 8640000 ){
        console.log(`${element.name} : today`)
      } else {
        console.log(`${element.name} : not today`)
      }
    })
  }, [tasks])

  return (
    <div className="App" >
      <div id="detail_bar">
        <Link to={"/AddTask"}><button>Add task</button></Link>
      </div>
      <div>
        <ol>
        {typeof tasks === "undefined"? <p>No tasks</p> : 
        tasks.map((item, index) => (
          <li key={index} id={"task_" + item.id} style={item.status === "Done"? {textDecoration : "line-through"} : {textDecoration : "none"}} className='tasks' >{item.name} - {item.description === ""? "No Description" : item.description} - {item.deadline} - {item.status} 
            <span id='taskControls'>

              {/* checkbox */}
              <input id={'taskDone_' + item.id} value="done" type='checkbox' onChange={(e) => {

                if(e.target.checked){
                  console.log(e.target.value)
                  e.target.parentElement.parentElement.style.textDecoration = "line-through"
                } else {
                  e.target.parentElement.parentElement.style.textDecoration = "none"
                }
                POSTFunction("/api/post/status", {"id" : item.id, "status" : e.target.checked? true : false}, (data) => {
                  console.log(data.message)
                })
                fetchTasks()
              }}/>

              {/* Edit button */}
              <button onClick={() => {
                // fetch command to get data of id to fill in the default text inputs on render 
                POSTFunction("/api/edit", {"id" : item.id}, (data) => setmodifyTasks(data))
                setedit(true)
                if(document.getElementById("ModifyTaskDiv") !== null) {
                  document.getElementById("ModifyTaskDiv").style.display = "block"
                }
              }}>Edit</button>

              {/* delete button */}
              <button onClick={() => {
                if(window.confirm('Do you want to delete')){

                  POSTFunction("/api/delete", {"id": item.id}, (data) => {
                    console.log(data.message)
                  })
                  fetchTasks();
                } else {
                  window.alert("Task not deleted")
                }
              }}>Delete</button>
            </span>
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

