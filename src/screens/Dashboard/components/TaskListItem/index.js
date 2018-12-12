import React, { Component } from 'react'
import moment from 'moment'
import { nav } from '../../../../shared/utils'
import './index.css'

export default class TaskListItem extends Component {
  render() {
    return (
      <div className="TaskListItem">
        <img src={`/graphics/${this.props.task.status}.svg`} alt={this.props.task.status} />
        <span>{`${this.props.task.name} (${this.props.task.numberOfSteps})`}</span>
        <span className="spacer"></span>
        <span>{moment(this.props.task.timestamp).fromNow()}</span>
        <img src={`/graphics/details.svg`} alt="details" onClick={this.openTaskDetails.bind(this)} />
      </div>
    )
  }
  openTaskDetails() {
    nav(`/task/${this.props.task.id}`)
  }
}
