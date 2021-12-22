import React, { Component, useState } from 'react'
import { getStepStatus } from '../../../../shared/utils'
import './index.css'
export default class StepListItem extends Component {
  render() {
    let status = getStepStatus(this.props.step)
    //let exec = getLastExec(this.props.step)
    return (
      <div className={`StepListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <img src={`graphics/${status}.svg`} alt={status} />
        <span>{this.props.step.name}</span>
        <div className="spacer"></div>
        {this.props.selected &&
          this.props.running ?
          <img className='wait' src={`graphics/wait.svg`} alt="wait" />: null
          
        }
        {
          this.props.selected &&
          !this.props.running ? 
          <img className='run' src={`graphics/play.svg`} alt="run" onClick={this.runStep.bind(this)} />: null
        }
        { this.props.selected &&
          <img className="details" src={`graphics/details.svg`} alt="details" onClick={this.editStep.bind(this)} />
        }
      </div>
    )
  }
  
  editStep(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.editStep(this.props.step)
  }
  runStep(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.runStep(this.props.step)
  }
}
