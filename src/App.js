import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'


const App = () => {
  // tasks is now part of the GLOBAL state (top level) instead of its own array
  // now the data can be used be all components
  // something like Redux can be used to manage state
  // state is immutable, so you can't just push new tasks here into the array
  // you can use setTasks to recreate the array with new (or less) data
  const [tasks, setTasks] = useState([])

  // Control visibility of Add Task form - defaults to false (not visible)
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])

    // // generate random task id
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,
                {
                  method: 'DELETE'
                })

    // filter the array to simulate deleting tasks (no backend)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    // iterate over tasks and only toggle the specified task (by id)
    setTasks(tasks.map((task) => task.id === id
              ? {...task, reminder: !task.reminder} : task))
  }

  // && is shorthand for ternary operator with no else needed
  return (
    <Router>
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      <Route path='/' exact render={(props) => (
        <>
          {showAddTask && <AddTask onAdd={addTask}/>}
            { tasks.length > 0
              ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
              : 'No Tasks To Show'
            }
        </>
      ) } />
      <Route path='/about' component={About}/>
      <Footer/>
    </div>
    </Router>
  );
}

export default App;
