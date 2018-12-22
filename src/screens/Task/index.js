import React, { Component } from 'react'
import { connect } from 'react-redux'
import FilterBar from '../../shared/components/FilterBar'
import rest from '../../store/rest'
import { getTaskStatus, isRestReady } from '../../shared/utils'
import './index.css'

class TaskBody extends Component {
  render() {
    // TODO: Make a path thing instead of that simple h1 - possible to navigate back in stack
    let status = getTaskStatus(this.props.task)
    // let lastexec = getTaskLastExec(this.props.task) - to figure out when it ran last and
    // what step to select and what exec stdout to show
    return (
      <div className="TaskBody">
        <div className="top">
          <img src={`/graphics/${status}.svg`} alt={status} />
          <h1>{this.props.task.name}</h1>
          <div className="spacer"></div>
          <div className="cron">{this.props.task.cron}</div>
          <img src={`/graphics/paused.svg`} alt="pause" />
        </div>
        <div className="StepList">

        </div>
      </div>
    )
  }
}

class Task extends Component {
  render() {
    let body = null
    if (isRestReady(this.props.task)) {
      let task = this.props.task.data
      body = <TaskBody {...this.props} task={task} />
    }
    return (
      <div className="Task">
        <FilterBar />
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
