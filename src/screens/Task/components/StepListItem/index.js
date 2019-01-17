import React, { Component } from 'react'
import { getStepStatus } from '../../../../shared/utils'
import './index.css'

export default class StepListItem extends Component {
  render() {
    let status = getStepStatus(this.props.step)
    //let exec = getLastExec(this.props.step)
    return (
      <div className={`StepListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <img src={`/graphics/${status}.svg`} alt={status} />
        <pre>{this.props.step.command}</pre>
        <div className="spacer"></div>
        { this.props.selected &&
          <img className="details" src={`/graphics/details.svg`} alt="details" onClick={this.editStep.bind(this)} />
        }
      </div>
    )
  }
  editStep() {
    this.props.editStep(this.props.step)
  }
}
