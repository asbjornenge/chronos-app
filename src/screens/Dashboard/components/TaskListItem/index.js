import React, { Component } from 'react'
import moment from 'moment'
import { nav } from '../../../../shared/utils'
import './index.css'

export default class TaskListItem extends Component {
  render() {
    let timestamp = null
    let status = 'passing'
    this.props.task.steps.forEach(s => {
      s.execs.forEach(e => {
        if (e.exitcode != 0) status = 'failing'
        if (timestamp === null) timestamp = moment(e.time_end)
        else if (moment(e.time_end) > timestamp) timestamp = moment(e.time_end)
      })
    })
    if (this.props.task.paused) status = 'paused'
    return (
      <div className="TaskListItem">
        <img src={`/graphics/${status}.svg`} alt={status} />
        <span>{`${this.props.task.name} (${this.props.task.steps.length})`}</span>
        <span className="spacer"></span>
        <span>{timestamp ? timestamp.fromNow() : 'Never'}</span>
        <img src={`/graphics/details.svg`} alt="details" onClick={this.openTaskDetails.bind(this)} />
      </div>
    )
  }
  openTaskDetails() {
    nav(`/task/${this.props.task.id}`)
  }
}
