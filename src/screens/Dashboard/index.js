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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { faHome } from '@fortawesome/free-solid-svg-icons'
import TopBar from '../../shared/components/TopBar'

const addTask = {
  id: 0,
  name: '',
  paused: true,
  steps: []
}

const Dashboard = (props) => {
  const [textFilter, setTextFilter] = useStore('textFilter')
  const [statusFilter, setStatusFilter] = useStore('statusFilter')
  const [tasks, setTasks, fetchTasks] = useTasks()
  const [adding, setAdding] = useState(false)

  let saveTask = async (updatedTask) => {
    await api.saveTask(updatedTask)
    setAdding(false)
    fetchTasks()
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
  __tasks = (
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Cron</TableCell>
              <TableCell align='right'>Next</TableCell>
              <TableCell align='right'>Last</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {__tasks}
          </TableBody>
        </Table>
      </TableContainer>)

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
      <TopBar 
        title={"Dashboard"}
        faIcon={faHome}
      />
      
      <div className={(tasks.error || tasks.loading) ? "TaskListItemsError" : "TaskListItems"}>
        {__tasks}
      </div> 
    </div>
  )
}

export default Dashboard