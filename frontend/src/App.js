import { Link } from 'react-router-dom';
import './App.css';
import { useEffect, useRef, useState } from 'react';

export function TaskEnter(){

  const task = useRef()
  const taskDesc = useRef()
  const deadline = useRef()
  
  function submit(e) {
    e.preventDefault()
  }



  function addtask(){
    let taskObj = {
      Task : task.current.value,
      TaskDesc: taskDesc.current.value,
      Deadline: deadline.current.value.replace("T", " ")
    }

    if(taskObj.Task !== "" && taskObj.Deadline !== ""){   
      fetch("api/post", {
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
        <form onSubmit={submit}>
          <div id='taskNamediv' className='taskFormdata'>
            <label htmlFor='taskName'>Task Name : </label>
            <input id='taskName' type='text' ref={task}></input>
          </div>
          <div id="taskDescdiv" className='taskFormdata'>
            <label htmlFor='taskDesc'>Task Description : </label>
            <textarea id='taskDesc' ref={taskDesc}></textarea>
          </div>
          <div id="deadlineDiv" className='taskFormdata'>
            <label htmlFor='deadline'>Deadline : </label>
            <input id='deadline' type="datetime-local" ref={deadline}></input>
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

export function App() {

  const [tasks, settasks] = useState([{}]);

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
            <span id='taskControls'><input type='checkbox'/><button>Edit</button><button onClick={() => {
              if(window.confirm('Do you want to delete')){
                fetch("/api/delete", {
                  method: "post",
                  headers: {"Content-Type" : "application/json"},
                  body: JSON.stringify({"id": item.id})
                }).then(response => response.json()).then(data => console.log(data))
                fetchTasks();
              } else {
                window.alert("Task not deleted")
              }
            }}>Delete</button></span>
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}

