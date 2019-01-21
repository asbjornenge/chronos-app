import React, { Component } from 'react'
import { connect } from 'react-redux'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import rest from '../../store/rest'
import { getTaskStatus, isRestReady } from '../../shared/utils'
import StepListItem from './components/StepListItem'
import StepForm from './components/StepForm'
import ExecListItem from './components/ExecListItem'
import ExecOutput from './components/ExecOutput'
import './index.css'

const addStep = {
  id: 0,
  execs: []
}

class TaskBody extends Component {
  render() {
    // TODO: Make a path thing instead of that simple h1 - possible to navigate back in stack
    let status = getTaskStatus(this.props.task)
    let execs = []
    let execOutput = null
    let _steps = [].concat(this.props.task.steps)
    if (this.props.addingStep) _steps.push(addStep)
    let steps = _steps.map(s => {
      let selected = this.props.selectedStep.id === s.id
      if (selected) execs = s.execs.map(e => {
        let _selected = this.props.selectedExec.id === e.id
        if (_selected) execOutput = <ExecOutput key={e.id+'output'} exec={e} />
        return <ExecListItem
                  key={e.id}
                  exec={e}
                  selected={_selected}
                  onClick={() => {this.props.setParentState({ selectedExec: e })}}
                />
      })
      return <StepListItem 
                key={s.id} 
                step={s} 
                selected={selected}
                editStep={(step) => {this.props.setParentState({ editingStep: step })}} 
                onClick={() => {this.props.setParentState({ selectedStep: s, selectedExec: {}, editingStep: null, addingStep: false })}}
              />
    })
    return (
      <div className="TaskBody">
        <div className="top">
          <img src={`/graphics/${status}.svg`} alt={status} />
          <h1>{this.props.task.name}</h1>
          <div className="spacer"></div>
          <div className="cron">{this.props.task.cron}</div>
          <img src={`/graphics/paused.svg`} alt="pause" />
        </div>
        <div className="TaskInfoWrapper">
          <div className="StepList">
            {steps}
          </div>
          { !this.props.editingStep &&
            <div className="ExecList">
              {execs}
            </div>
          }
          { !this.props.editingStep &&
            <div className="ExecOutput">
              {execOutput}
            </div>
          }
          { this.props.editingStep &&
            <div className="StepEdit">
              <StepForm 
                step={this.props.editingStep}
                onCancel={this.cancelStepForm.bind(this)}
                onDelete={this.deleteStep.bind(this)}
                onSubmit={this.submitStepForm.bind(this)} 
              />
            </div>
          }
        </div>
      </div>
    )
  }
  deleteStep(step) {
    let payload = { id: step.id, task: this.props.task.id }
    this.props.dispatch(rest.actions.step.delete(payload, (err, data) => {
      if (err) return console.error(err)
      this.props.setParentState({ editingStep: null, selectedStep: {}, addingStep: false })
      this.props.dispatch(rest.actions.task.reset())
      this.props.dispatch(rest.actions.task.sync({id:this.props.task.id, steps:true, execs:10}))
    }))
  }
  cancelStepForm() {
    this.props.setParentState({ editingStep: null, addingStep: false })
  }
  submitStepForm(values) {
    let adding = values.id === 0
    let action = rest.actions.step.put
    let payload = { id: values.id, task: this.props.task.id }
    if (adding) {
      action = rest.actions.steps.post
      delete values.id 
      payload = { task: this.props.task.id } 
    }
    this.props.dispatch(action(payload, { body: JSON.stringify(values) }, (err, data) => {
      if (err) return console.error(err)
      this.props.setParentState({ editingStep: data, selectedStep: data, addingStep: false })
      this.props.dispatch(rest.actions.task.reset())
      this.props.dispatch(rest.actions.task.sync({id:this.props.task.id, steps:true, execs:10}))
    }))
  }
}

class Task extends Component {
  state = {
    selectedStep: {},
    selectedExec: {},
    editingStep: null,
    addingStep: false
  }
  render() {
    let body = null
    let loading = this.props.task.loading
    let error = this.props.task.error != null
    if (loading) {
      body = (
        <div className="TaskError">
          <Loading style={{flex:'auto', width: 200, height: 200}} />
        </div>
      )
    }
    if (error) {
      body = (
        <div className="TaskError">
          <Error message={this.props.task.error.message} />
        </div>
      )
    }
    if (isRestReady(this.props.task)) {
      body = <TaskBody 
              {...this.props} 
              {...this.state} 
              setParentState={this.setState.bind(this)} 
              task={this.props.task.data} 
            />
    }
    return (
      <div className="Task">
        <FilterBar 
          placeholder="Step name" 
          type="step"
          onAddClick={this.toggleAddStep.bind(this)}
         />
        {body} 
      </div>
    )
  }
  toggleAddStep() {
    this.setState({ 
      addingStep: !this.state.addingStep,
      editingStep: !this.state.addingStep ? addStep : null, 
      selectedStep: !this.state.addingStep ? addStep : {} 
    })
  }
  componentDidMount() {
    this.props.dispatch(rest.actions.task({id:this.props.id, steps:true, execs:10}))
  }
}

export default connect(
  (state) => {
    return {
      task: state.task
    }
  },
  (dispatch) => {
    return {
      dispatch: dispatch
    }
  }
)(Task)
