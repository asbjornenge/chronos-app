import React, { Component } from 'react'
import moment from 'moment'
import './index.css'

export default class ExecListItem extends Component {
  render() {
    let status = this.props.exec.exitcode === 0 ? 'passing' : 'failing'
    let date = moment(this.props.exec.time_start).format('DD-MM-YYYY')
    let start = moment(this.props.exec.time_start).format('hh:mm:ss')
    let end = moment(this.props.exec.time_end).format('hh:mm:ss')
    let diff = moment(this.props.exec.time_end).diff(this.props.exec.time_start, 'seconds')
    return (
      <div className={`ExecListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <img src={`graphics/${status}.svg`} alt={status} />
        <span className="date">{date}</span>
        <span className="meta">from</span><span className="date">{start}</span>
        <span className="meta">to</span><span className="date">{end}</span>
        <span className="meta">for</span><span className="date">{diff+'s'}</span>
      </div>
    )
  }
}
