import React, { Component } from 'react'
//import { connect } from 'react-redux'
import moment from 'moment'
import './index.css'

export default class TaskListItem extends Component {
  render() {
    return (
      <div className="TaskListItem">
        <img src={`/graphics/${this.props.task.status}.svg`} alt={this.props.task.status} />
        <span>{`${this.props.task.name} (${this.props.task.numberOfSteps})`}</span>
        <span className="spacer"></span>
        <span>{moment(this.props.task.timestamp).fromNow()}</span>
      </div>
    )
  }
}
