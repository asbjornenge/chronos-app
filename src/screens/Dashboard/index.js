import React, { useState } from 'react'
import { useStore } from 'react-hookstore'
import TaskListItem from './components/TaskListItem'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import { setTaskStatus } from '../../shared/utils'
import { useTasks } from '../../shared/hooks'
import * as api from '../../shared/api'
import './index.css'

const addTask = {
  id: 0,
  name: '',
  paused: true,
  steps: []
}

export default (props) => {
  const [textFilter, setTextFilter] = useStore('textFilter')
  const [statusFilter, setStatusFilter] = useStore('statusFilter')
  const [tasks, setTasks] = useTasks()
  const [adding, setAdding] = useState(false)

  let saveTask = async (updatedTask) => {
    let task = await api.saveTask(updatedTask)
    task = await api.getTask(task.id, '?steps=true&execs=1') 
    setAdding(false)
    if (!updatedTask.id)
      setTasks([task].concat(tasks))
    else
      setTasks(tasks.map(t => t.id === task.id ? task : t))
  }

  let removeTask = async (task) => {
    setAdding(false)
    await api.removeTask(task)
    setTasks(tasks.filter(t => t.id !== task.id))
  }

  let _tasks = tasks
  if (adding) _tasks = [addTask].concat(_tasks)
  let __tasks = _tasks 
    .map(setTaskStatus)
    .filter(t => {
      if (statusFilter === '') return true
      if (statusFilter === t.status) return true
      return false
    })
    .filter(t => {
      if (textFilter === '') return true
      if (t.name.toLowerCase().indexOf(textFilter.toLowerCase()) >= 0) return true
      return false
    })
    .map(t => {
      return (
        <TaskListItem 
          key={t.id} 
          task={t}
          saveTask={saveTask}
          removeTask={removeTask}
        />
      )
    })
  if (tasks.loading) {
    __tasks = <Loading style={{flex:'auto', width: 200, height: 200}} />
  }
  if (tasks.error) {
    __tasks = <Error message={tasks.error} />
  }

  return (
    <div className="Dashboard">
      <FilterBar 
        placeholder="Task name" 
        type="task" 
        textFilter={textFilter}
        setTextFilter={setTextFilter}
        statusFilter={statusFilter}
        setStatusFilter={(status) => {
          let _status = status === statusFilter ? '' : status
          setStatusFilter(_status)
        }}
        onAddClick={() => setAdding(!adding)} 
      />
      <div className={(tasks.error || tasks.loading) ? "TaskListItemsError" : "TaskListItems"}>
        {__tasks}
      </div> 
    </div>
  )
}
