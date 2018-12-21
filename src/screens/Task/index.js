import React, { Component } from 'react'
import { connect } from 'react-redux'
import FilterBar from '../../shared/components/FilterBar'
import rest from '../../store/rest'
import { getTaskStatus, isRestReady } from '../../shared/utils'
import './index.css'

class TaskBody extends Component {
  render() {
    let status = getTaskStatus(this.props.task)
    return (
      <div className="TaskBody">
        <div className="top">
          <img src={`/graphics/${status}.svg`} alt={status} />
          <h1>{this.props.task.name}</h1>
        </div>
      </div>
    )
  }
}

class Task extends Component {
  render() {
    let body = null
    if (isRestReady(this.props.task) && isRestReady(this.props.steps)) {
      let task = this.props.task.data
      task.steps = this.props.steps.data.data
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
    this.props.dispatch(rest.actions.task({id:this.props.id}))
    this.props.dispatch(rest.actions.steps({task:this.props.id}))
  }
}

export default connect(
  (state) => {
    return {
      task: state.task,
      steps: state.steps
    }
  },
  (dispatch) => {
    return {
      dispatch: dispatch
    }
  }
)(Task)
