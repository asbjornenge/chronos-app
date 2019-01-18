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

class TaskBody extends Component {
  render() {
    // TODO: Make a path thing instead of that simple h1 - possible to navigate back in stack
    let status = getTaskStatus(this.props.task)
    let execs = []
    let execOutput = null
    let steps = this.props.task.steps.map(s => {
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
                onClick={() => {this.props.setParentState({ selectedStep: s, selectedExec: {}, editingStep: null })}}
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
                onSubmit={this.submitStepForm.bind(this)} 
              />
            </div>
          }
        </div>
      </div>
    )
  }
  cancelStepForm() {
    this.props.setParentState({ editingStep: null })
  }
  submitStepForm(values) {
    this.props.dispatch(rest.actions.step.put({id: values.id, task: this.props.task.id}, { body: JSON.stringify(values) }, (err, data) => {
      if (err) return console.error(err)
      this.props.setParentState({ editingStep: values })
      this.props.dispatch(rest.actions.task.reset())
      this.props.dispatch(rest.actions.task.sync({id:this.props.task.id, steps:true, execs:10}))
    }))
  }
  componentDidMount() {
    let selectedStep, selectedExec;
    this.props.task.steps.forEach((s) => {
      s.execs.forEach(e => {
        if (!selectedExec) {
          selectedExec = e
          selectedStep = s
        }
        if (e.time_start > selectedExec.time_start) {
          selectedExec = e
          selectedStep = s
        }
      })
    })
    if (selectedExec) {
      this.props.setParentState({
        selectedStep: selectedStep,
        selectedExec: selectedExec
      })
    }
  }
}

class Task extends Component {
  state = {
    selectedStep: {},
    selectedExec: {},
    editingStep: null
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
      body = <TaskBody {...this.props} {...this.state} setParentState={this.setState.bind(this)} task={this.props.task.data} />
    }
    return (
      <div className="Task">
        <FilterBar placeholder="Step name" type="step" />
        {body} 
      </div>
    )
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
