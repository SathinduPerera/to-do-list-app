import { Link } from 'react-router-dom';
import './App.css';

export function TaskEnter(){

  function submit(e) {
    e.preventDefault()
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
          <input id='taskName' type='text'></input>
          </div>
          <div id="taskDescdiv" className='taskFormdata'>
          <label htmlFor='taskDesc'>Task Description : </label>
          <textarea id='taskDesc'></textarea>
          </div>
          <div id="deadlineDiv" className='taskFormdata'>
          <label htmlFor='deadline'>Deadline : </label>
          <input id='deadline' type="datetime-local"></input>
          </div>
          <button>Add task</button>
          <button>Add another task</button>
          <button>Back to home</button>
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

