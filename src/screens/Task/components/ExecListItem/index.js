import React, { Component } from 'react'
import moment from 'moment'
import './index.css'

export default class ExecListItem extends Component {
  render() {
    let status = this.props.exec.exitcode === 0 ? 'passing' : 'failing'
    let date = moment(this.props.exec.time_start).format('DD-MM-YYYY')
    let start = moment(this.props.exec.time_start).format('hh:mm:ss')
    let end = moment(this.props.exec.time_end).format('hh:mm:ss')
    let diff = moment(this.props.exec.time_start).diff(this.props.exec.time_end, 'seconds')
    return (
      <div className={`ExecListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <img src={`/graphics/${status}.svg`} alt={status} />
        <span>{`${date} ${start}`}</span>
        <span className="spacer"></span>
        <div className="times">
          <div>{`Start: ${start}`}</div>
          <div>{`End: ${end}`}</div>
          <div>{`Runtime: ${diff} s`}</div>
        </div>
      </div>
    )
  }
}
