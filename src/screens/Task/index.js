import React, { useState } from 'react'
import { useStore } from 'react-hookstore'
import { useTasks } from '../../shared/hooks'
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
        onAddClick={props.toggleAddStep}
       />
      {props.children}
    </div>
  )
}

export default (props) => {
  let [selectedStep, setSelectedStep] = useState({})
  let [selectedExec, setSelectedExec] = useState({})
  let [editingStep, setEditingStep] = useState(null)
  let [addingStep, setAddingStep] = useState(false)
  let [tasks, setTasks] = useTasks() 
  let loading = false 
  let error = false 

  let toggleAddStep = () => {
    setAddingStep(!addingStep)
  }

  let task = tasks.reduce((selected, t) => {
    if (selected) return selected
    if (t.id === parseInt(props.id)) selected = t
    return selected
  }, null)

  if (!task) loading = true

  if (loading) {
    return (
      <TaskWrapper toggleAddStep={toggleAddStep}>
        <div className="TaskError">
          <Loading style={{flex:'auto', width: 200, height: 200}} />
        </div>
      </TaskWrapper>
    )
  }
  if (error) {
    return (
      <TaskWrapper toggleAddStep={toggleAddStep}>
        <div className="TaskError">
          <Error message={task.error.message} />
        </div>
      </TaskWrapper>
    )
  }
  // TODO: Make a path thing instead of that simple h1 - possible to navigate back in stack
  let status = getTaskStatus(task)
  let execs = []
  let execOutput = null
  let _steps = [].concat(task.steps)
  if (addingStep) _steps.push(addStep)
  let steps = _steps.map(s => {
    let selected = selectedStep.id === s.id
    if (selected) execs = s.execs.map(e => {
      let _selected = props.selectedExec.id === e.id
      if (_selected) execOutput = <ExecOutput key={e.id+'output'} exec={e} />
      return <ExecListItem
                key={e.id}
                exec={e}
                selected={_selected}
                onClick={() => {props.setParentState({ selectedExec: e })}}
              />
    })
    return <StepListItem 
              key={s.id} 
              step={s} 
              selected={selected}
              editStep={(step) => {props.setParentState({ editingStep: step })}} 
              onClick={() => {props.setParentState({ selectedStep: s, selectedExec: {}, editingStep: null, addingStep: false })}}
            />
  })
  let togglePauseIcon = task.paused ? 'play' : 'paused'
  return (
    <TaskWrapper toggleAddStep={toggleAddStep}>
      <div className="TaskBody">
        <div className="top">
          <img src={`graphics/${status}.svg`} alt={status} />
          <h1>{task.name}</h1>
          <div className="spacer"></div>
          <div className="cron">{task.cron}</div>
          <img src={`graphics/${togglePauseIcon}.svg`} alt="pause" onClick={() => this.togglePause.bind(this)} />
        </div>
        <div className="TaskInfoWrapper">
          <div className="StepList">
            {steps}
          </div>
          { !props.editingStep &&
            <div className="ExecList">
              {execs}
            </div>
          }
          { !props.editingStep &&
            <div className="ExecOutput">
              {execOutput}
            </div>
          }
          { props.editingStep &&
            <div className="StepEdit">
              <StepForm 
                step={props.editingStep}
                onCancel={this.cancelStepForm.bind(this)}
                onDelete={this.deleteStep.bind(this)}
                onSubmit={this.submitStepForm.bind(this)} 
              />
            </div>
          }
        </div>
      </div>
    </TaskWrapper>
  )
}
//  deleteStep(step) {
//    let payload = { id: step.id, task: task.id }
//    props.dispatch(rest.actions.step.delete(payload, (err, data) => {
//      if (err) return console.error(err)
//      props.setParentState({ editingStep: null, selectedStep: {}, addingStep: false })
//      props.dispatch(rest.actions.task.reset())
//      props.dispatch(rest.actions.task.sync({id:task.id, steps:true, execs:10}))
//    }))
//  }
//  cancelStepForm() {
//    props.setParentState({ editingStep: null, addingStep: false })
//  }
//  submitStepForm(values) {
//    let adding = values.id === 0
//    let action = rest.actions.step.put
//    let payload = { id: values.id, task: task.id }
//    if (adding) {
//      action = rest.actions.steps.post
//      delete values.id 
//      payload = { task: task.id } 
//    }
//    props.dispatch(action(payload, { body: JSON.stringify(values) }, (err, data) => {
//      if (err) return console.error(err)
//      props.setParentState({ editingStep: data, selectedStep: data, addingStep: false })
//      props.dispatch(rest.actions.task.reset())
//      props.dispatch(rest.actions.task.sync({id:task.id, steps:true, execs:10}))
//    }))
//  }
//  async togglePause() {
//    let res = await fetch(`${window.apihost}/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify({ paused: !task.paused}) })
//    if (!res.ok) return
//    props.dispatch(rest.actions.task.reset())
//    props.dispatch(rest.actions.task.sync({id:task.id, steps:true, execs:10}))
//  }
//}

//  toggleAddStep() {
//    this.setState({ 
//      addingStep: !this.state.addingStep,
//      editingStep: !this.state.addingStep ? addStep : null, 
//      selectedStep: !this.state.addingStep ? addStep : {} 
//    })
//  }
//  componentDidMount() {
//    props.dispatch(rest.actions.task({id:props.id, steps:true, execs:10}))
//  }

//export default connect(
//  (state) => {
//    return {
//      task: state.task
//    }
//  },
//  (dispatch) => {
//    return {
//      dispatch: dispatch
//    }
//  }
//)(Task)
