import React, { Component } from 'react'
import moment from 'moment'
import { getStepStatus, getLastExec } from '../../../../shared/utils'
import './index.css'

export default class StepListItem extends Component {
  render() {
    let status = getStepStatus(this.props.step)
    let exec = getLastExec(this.props.step)
    return (
      <div className={`StepListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <img src={`/graphics/${status}.svg`} alt={status} />
        <pre>{this.props.step.command}</pre>
        <div className="spacer"></div>
        { exec != null &&
          <span>{moment(exec.time_start).format('DD-MM-YYYY hh:mm:ss')}</span>
        }
      </div>
    )
  }
}
