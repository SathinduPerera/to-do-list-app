import { Link } from 'react-router-dom';
import './App.css';
import { useRef } from 'react';

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

    fetch("api/post", {
      method: "post", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(taskObj)
    }).then((response) => response.json()).then((data) => {console.log(data.message)})
    
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
            <input id='taskName' type='text' ref={task} required></input>
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

  let tasks

  return (
    <div className="App">
      <div id="detail_bar">
        <Link to={"/AddTask"}><button>Add task</button></Link>
      </div>
      <div>
        {typeof tasks === "undefined"? <p>No tasks</p> : 
        tasks.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}

