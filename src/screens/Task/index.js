import React, { Component } from 'react'
import { connect } from 'react-redux'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import rest from '../../store/rest'
import { getTaskStatus, isRestReady } from '../../shared/utils'
import StepListItem from './components/StepListItem'
import './index.css'

class TaskBody extends Component {
  render() {
    // TODO: Make a path thing instead of that simple h1 - possible to navigate back in stack
    let status = getTaskStatus(this.props.task)
    // let lastexec = getTaskLastExec(this.props.task) - to figure out when it ran last and
    // what step to select and what exec stdout to show
    let steps = this.props.task.steps.map(s => {
      return <StepListItem key={s.id} step={s} />
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
          <div className="ExecList">
            execs here
          </div>
          <div className="ExecOutput">
            outout here
          </div>
        </div>
      </div>
    )
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
