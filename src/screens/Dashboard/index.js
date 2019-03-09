import React, { useState } from 'react'
import { useStore } from 'react-hookstore'
import TaskListItem from './components/TaskListItem'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import { setTaskStatus } from '../../shared/utils'
import './index.css'

const addTask = {
  id: 0,
  name: '',
  paused: true,
  steps: []
}

export default (props) => {
  const error = false
  const [textFilter, setTextFilter] = useStore('textFilter')
  const [statusFilter, setStatusFilter] = useStore('statusFilter')
  const [tasks, setTasks] = useStore('tasks')
  const [adding, setAdding] = useState(false)

  let _tasks = tasks 
    .map(setTaskStatus)
    .filter(t => {
      if (textFilter === '') return true
      if (textFilter === t.status) return true
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
          saveTask={this.saveTask.bind(this)} 
          removeTask={this.removeTask.bind(this)} 
        />
      )
    })
  if (adding) _tasks = [addTask].concat(_tasks)
//  let error = (this.props.tasks.loading || this.props.tasks.error != null)
  if (error) {
    _tasks = <Loading style={{flex:'auto', width: 200, height: 200}} />
  }
  if (error) {
    _tasks = <Error message={this.props.tasks.error.message} />
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
      <div className={error ? "TaskListItemsError" : "TaskListItems"}>
        {_tasks}
      </div> 
    </div>
  )
}
