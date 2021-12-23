import React, { useState } from 'react'
import { useTasks } from '../../shared/hooks'
import * as api from '../../shared/api'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import { getTaskStatus } from '../../shared/utils'
import StepListItem from './components/StepListItem'
import StepForm from './components/StepForm'
import ExecListItem from './components/ExecListItem'
import ExecOutput from './components/ExecOutput'
import './index.css'

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
       />
      {props.children}
    </div>
  )
}

export default (props) => {
  const [selectedStep, setSelectedStep] = useState({})
  const [selectedExec, setSelectedExec] = useState({})
  const [editingStep, setEditingStep] = useState(null)
  const [addingStep, setAddingStep] = useState(false)
  const [textFilter, setTextFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tasks, setTasks] = useTasks() 
  const [runningStep, setRunningStep] = useState('')
  const [runningTask, setRunningTask] = useState(false)

  let toggleAddStep = () => {
    let isAdding = !addingStep
    setAddingStep(!addingStep)
    setEditingStep(isAdding ? addStep : null)
    setSelectedStep(isAdding ? addStep : {})
  }

  let task = tasks.reduce((selected, t) => {
    if (selected) return selected
    if (t.id === parseInt(props.id)) selected = t
    return selected
  }, null)

  if (tasks.loading) {
    return (
      <TaskWrapper toggleAddStep={toggleAddStep}>
        <div className="TaskError">
          <Loading style={{flex:'auto', width: 200, height: 200}} />
        </div>
      </TaskWrapper>
    )
  }
  if (tasks.error) {
    return (
      <TaskWrapper toggleAddStep={toggleAddStep}>
        <div className="TaskError">
          <Error message={tasks.error} />
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

  let status = getTaskStatus(task)
  let execs = []
  let execOutput = null
  let _steps = [].concat(task.steps)
  if (addingStep) _steps.push(addStep)
  _steps.sort((a,b) => (a.sort_order > b.sort_order) ? 1 : -1)

  let steps = _steps.sort((a,b) => (a.sort_order > b.sort_order) ? 1 : -1).map(s => {
    let running = runningStep === s.id ? true : false
    let selected = selectedStep.id === s.id
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
              }}
              running = {running}
            />
  })
  let togglePauseIcon = task.paused ? 'play' : 'paused'
  let togglePause = async () => {
    let res = await api.toggleTaskPause(task)
    if (!res.ok) return console.error(res.message) 
    task.paused = !task.paused 
    setTasks(tasks.map(t => t.id === task.id ? task : t))
  }
  let OnRunStep = async(step) => {
    setRunningStep(step.id)
    await api.runStep(step)
    setRunningStep('')
    let newtask = await api.getTask(step.task, '?steps=true&execs=10')
    setTasks(tasks.map(t => t.id === step.task ? newtask : t)) 
    if (!res.ok) return console.error(res.message)
  }

  let OnRun = async() => {
    setRunningTask(true)
    let res = await api.runTask(task)
    setRunningTask(false)
    let newtask = await api.getTask(task.id, '?steps=true&execs=10')
    setTasks(tasks.map(t => t.id === task.id ? newtask : t)) 
    if (!res.ok) return console.error(res.message)
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
        <div className="top">
          <img src={`graphics/${status}.svg`} alt={status} />
          <h1>{task.name}</h1>
          <div className="spacer"></div>
          {
            runningTask ? 
            <img src={`graphics/wait.svg`} alt="wait" className='runicon' />:
            <img src={`graphics/run.svg`} alt="run" onClick={OnRun} className='runicon'/>
          }
          
          <div className="cron">{task.cron}</div>
          <img src={`graphics/${togglePauseIcon}.svg`} alt="pause" onClick={togglePause} />
        </div>
        <div className="TaskInfoWrapper">
          <div className="StepList">
            {steps}
          </div>
          { !editingStep &&
            <div className="ExecList">
              {execs}
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
                  setTasks(tasks.map(t => t.id === task.id ? task : t))
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
//  async togglePause() {
//    let res = await fetch(`${window.apihost}/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify({ paused: !task.paused}) })
//    if (!res.ok) return
//    props.dispatch(rest.actions.task.reset())
//    props.dispatch(rest.actions.task.sync({id:task.id, steps:true, execs:10}))
//  }
//}