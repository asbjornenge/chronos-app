import React, { useEffect, useState } from 'react'
import * as api from '../../shared/api'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import { getTaskStatus, getStepStatus } from '../../shared/utils'
import StepListItem from './components/StepListItem'
import StepForm from './components/StepForm'
import ExecListItem from './components/ExecListItem'
import ExecOutput from './components/ExecOutput'
import './index.css'
import { toast } from 'react-toastify';
import TopBar from '../../shared/components/TopBar'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';

const addStep = {
  id: 0,
  execs: []
}

const TaskWrapper = (props) => {
  return (
    <div className="Task">
      <FilterBar 
        placeholder="Step name" 
        type="step"
        textFilter={props.textFilter}
        setTextFilter={props.setTextFilter}
        statusFilter={props.statusFilter}
        setStatusFilter={props.setStatusFilter}
        onAddClick={props.toggleAddStep}
        disabledStatus={['paused']}
       />
      {props.children}
    </div>
  )
}


const Task = (props) => {
  const [selectedStep, setSelectedStep] = useState({})
  const [selectedExec, setSelectedExec] = useState({})
  const [editingStep, setEditingStep] = useState(null)
  const [addingStep, setAddingStep] = useState(false)
  const [textFilter, setTextFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [ctasks, setcTasks] = useState([]) 

  const setStepHash = (s) => {
    window.location.hash = `#/task/${props.id}/step/${s}`
  }

  useEffect(() => {
    (async () => {
      setcTasks(await api.getTaskDashboard(props.id))
    })()
  }, [])

  useEffect(function() {
    const { csocket } = require('../../shared/socket')

    let socket = csocket()
    socket.emit("tJoin", `/task/${props.id}`)

    socket.on("newExec", (d) => {
      setSelectedStep({id : d.step})
      setSelectedExec(d)
      setcTasks((p) => {
        for (let step of p.steps) {
          if (step.id === d.step) {
            step.execs.push(d)
            step.execs.sort((a,b) => (a.time_start > b.time_start) ? -1 : 1)
            step.execs = step.execs.slice(0,10)
          }
        }
        return {...p}
      })
    })
    socket.on('updateExec', (d) => {
      setcTasks((p) => {
        let temp = {...p}
        for (let step of temp.steps) {
          if (step.id === d.step) {
            for (let [index, exec] of step.execs.entries()) {
              if (exec.id === d.id ) {
                step.execs[index] = d
                break
              }
            }
            
          }
        }
        return {...temp}
      })
    })

    return function cleanup() {
      socket.off('newExec')
      socket.off('updateExec')
      socket.emit("tLeave", `/task/${props.id}`)
    }
  }, [])
  
  let toggleAddStep = () => {
    let isAdding = !addingStep
    setAddingStep(!addingStep)
    setEditingStep(isAdding ? addStep : null)
    setSelectedStep(isAdding ? addStep : {})
  }

  let task = ctasks  

  if (Object.keys(ctasks).length === 0) {
    return (
      <TaskWrapper toggleAddStep={toggleAddStep}>
        <div className="TaskError">
          <Loading style={{flex:'auto', width: 200, height: 200}} />
        </div>
      </TaskWrapper>
    )
  }
  if (ctasks.error) {
    return (
      <TaskWrapper toggleAddStep={toggleAddStep}>
        <div className="TaskError">
          <Error message={ctasks.error} />
        </div>
      </TaskWrapper>
    )
  }
  if (!task) {
    return (
      <TaskWrapper toggleAddStep={toggleAddStep}>
        <div className="TaskError">
          <Error message="404 Task not found" />
        </div>
      </TaskWrapper>
    )
  }

  let status = getTaskStatus(ctasks)
  let execs = []
  let execOutput = null
  let _steps = [].concat(ctasks.steps)
  if (addingStep) _steps.push(addStep)
  //_steps.sort((a,b) => (a.sort_order > b.sort_order) ? 1 : -1)

  let steps = _steps.sort((a,b) => (a.sort_order > b.sort_order) ? 1 : -1)
    .filter(s => {
      if (statusFilter === '') return true
      if (statusFilter === getStepStatus(s)) return true
      return false
    })
    .filter(s => {
      if (textFilter === '') return true
      if (s.name.toLowerCase().indexOf(textFilter.toLowerCase()) >= 0) return true
      return false
    })
    .map(s => {
    let selected = selectedStep.id === s.id || (s.id?.toString() === props.stepid?.toString() && selectedStep.id === undefined)
    if (selected) execs = s.execs.map(e => {
      let _selected = selectedExec.id === e.id
      if (_selected) execOutput = <ExecOutput key={e.id+'output'} exec={e} />
      return <ExecListItem
                key={e.id}
                exec={e}
                selected={_selected}
                onClick={() => setSelectedExec(e)}
              />
    })
    return <StepListItem 
              key={s.id} 
              step={s} 
              selected={selected}
              editStep={(step) => {setEditingStep(step)}}
              runStep={(step) => {OnRunStep(step)}}
              onClick={() => {
                setSelectedStep(s)
                setSelectedExec({})
                setEditingStep(null)
                setAddingStep(false)
                setStepHash(s.id)
              }}
            />
  })
  let togglePause = async () => {
    let res = await api.toggleTaskPause(task)
    if (!res.ok) return console.error(res.message) 
    task.paused = !task.paused 
    setcTasks({...task})
  }
  let OnRunStep = async(step) => {
    await toast.promise(api.runStep(step), 
    {
      pending: "Running step: " + step.name,
      success: "Scheduled step:" + step.name,
      error: "Failed step: " + step.name
    })
  }

  let OnRun = async() => {    
    await toast.promise(api.runTask(task), 
    {
      pending: "Running task: " + task.name,
      success: "Scheduled task:" + task.name,
      error: "Failed task: " + task.name
    })
  }
  
  
  return (
    <TaskWrapper 
      textFilter={textFilter}
      setTextFilter={setTextFilter}
      statusFilter={statusFilter}
      setStatusFilter={(status) => {
        let _status = status === statusFilter ? '' : status
        setStatusFilter(_status)
        }}
      toggleAddStep={toggleAddStep}
    >
      <div className="TaskBody">
        <TopBar
          SvgIcon = {<img src={`graphics/${status}.svg`} alt={status} />}
          title = { " " + task.name}
        >
            <span>
              {status === 'run' ? 
              <img src={`graphics/wait.svg`} alt="wait" className='runicon' />:
              <img src={`graphics/run.svg`} alt="run" onClick={OnRun} className='runicon img-clickable'/>}
              <div className="cron">{task.cron}</div>
              {
                ctasks.paused ? 
                <img src={`graphics/${ 'play' }.svg`} alt="pause" onClick={togglePause} className='img-clickable'/>:
                <img src={`graphics/${'paused'}.svg`} alt="pause" onClick={togglePause} className='img-clickable'/>
              }
            </span>
          
        </TopBar>
        <div className="TaskInfoWrapper">
          <div className="StepList">
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 600}} aria-label="a dense table">
              <TableHead>
              </TableHead>
              <TableBody>
                {steps}
              </TableBody>
            </Table>
          </TableContainer>
          </div>
          { !editingStep &&
            <div className="ExecList">
              <TableContainer component={Paper}>
                <Table sx={{minWidth: 600}} aria-label="a dense table">
                  <TableHead>
                  </TableHead>
                  <TableBody>
                    {execs}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </div>
          }
          { !editingStep &&
            <div className="ExecOutput">
              {execOutput}
            </div>
          }
          { editingStep &&
            <div className="StepEdit">
              <StepForm 
                numSteps={task.steps.length}
                step={editingStep}
                onCancel={() => {
                  setEditingStep(null)
                  setAddingStep(false)
                }}
                onDelete={async (step) => {
                  await api.removeStep(step, task)
                  task.steps = task.steps.filter(s => s.id !== step.id)
                  setEditingStep(null)
                  setSelectedStep({})
                  setAddingStep(false)
                }}
                onSubmit={async (values, step) => {
                  let adding = values.id === 0
                  let _step = await api.saveStep(values, task)
                  if (adding) {
                    _step.execs = []
                    task.steps.push(_step)
                  } else {
                    _step.execs = step.execs
                    task.steps = task.steps.map(s => s.id === _step.id ? _step : s)
                  }
                  setcTasks(task)
                  setEditingStep(_step)
                  setSelectedStep(_step)
                  setAddingStep(false)
                }} 
              />
            </div>
          }
        </div>
      </div>
    </TaskWrapper>
  )
}

export default Task