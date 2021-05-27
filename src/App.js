import {useState, useEffect} from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'


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
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json()
      console.log(data)
    }
    fetchTasks()
  }, [])

  // Add Task
  const addTask = (task) => {
    // generate random task id
    const id = Math.floor(Math.random() * 10000) + 1;
    const newTask = {id, ...task}
    setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = (id) => {
    // filter the array to simulate deleting tasks (no backend)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = (id) => {
    // iterate over tasks and only toggle the specified task (by id)
    setTasks(tasks.map((task) => task.id === id
              ? {...task, reminder: !task.reminder}
              : task))
  }

  // && is shorthand for ternary operator with no else needed
  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      {showAddTask && <AddTask onAdd={addTask}/>}
      { tasks.length > 0
        ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
        : 'No Tasks To Show'
      }
    </div>
  );
}

export default App;
