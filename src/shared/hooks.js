import { useEffect } from 'react'
import { useStore } from 'react-hookstore'

const useTasks = () => {
  let [tasks, setTasks] = useStore('tasks')
  
  async function fetchTasks() {
    if (tasks.length > 0) return
    let _tasks = tasks.slice()
    _tasks.loading = true
    setTasks(_tasks)
    _tasks = await fetch(`${window.apihost}/dashboard`)
      .then(res => res.json())
      .catch(e => { tasks.error = e.message; return tasks })
    _tasks.loading = false
    setTasks(_tasks)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return [tasks, setTasks]
}

export {
  useTasks
}
