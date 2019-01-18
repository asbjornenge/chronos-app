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
  state = {
    selectedStep: {},
    selectedExec: {},
    editingStep: null
  }
  render() {
    // TODO: Make a path thing instead of that simple h1 - possible to navigate back in stack
    let status = getTaskStatus(this.props.task)
    // let lastexec = getTaskLastExec(this.props.task) - to figure out when it ran last and
    // what step to select and what exec stdout to show
    let execs = []
    let execOutput = null
    let steps = this.props.task.steps.map(s => {
      let selected = this.state.selectedStep.id === s.id
      if (selected) execs = s.execs.map(e => {
        let _selected = this.state.selectedExec.id === e.id
        if (_selected) execOutput = <ExecOutput key={e.id+'output'} exec={e} />
        return <ExecListItem
                  key={e.id}
                  exec={e}
                  selected={_selected}
                  onClick={() => {this.setState({ selectedExec: e })}}
                />
      })
      return <StepListItem 
                key={s.id} 
                step={s} 
                selected={selected}
                editStep={(step) => {this.setState({ editingStep: step })}} 
                onClick={() => {this.setState({ selectedStep: s, selectedExec: {}, editingStep: null })}}
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
          { !this.state.editingStep &&
            <div className="ExecList">
              {execs}
            </div>
          }
          { !this.state.editingStep &&
            <div className="ExecOutput">
              {execOutput}
            </div>
          }
          { this.state.editingStep &&
            <div className="StepEdit">
              <h2>Edit name-of-step</h2>
              <StepForm ref="form" step={this.state.editingStep} />
              <div className="buttons">
                <button onClick={this.submitStepForm.bind(this)}>Save</button>
                <button onClick={() => {this.setState({ editingStep: null })}}>Cancel</button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
  submitStepForm() {
    this.refs.form.submit()
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
      this.setState({
        selectedStep: selectedStep,
        selectedExec: selectedExec
      })
    }
  }
}

class Task extends Component {
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
      body = <TaskBody {...this.props} task={this.props.task.data} />
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
