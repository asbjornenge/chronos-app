import React, { Component } from 'react'
import './index.css'

export default class StepListItem extends Component {
  render() {
    return (
      <div className="StepListItem">
        <span>{this.props.step.command}</span>
      </div>
    )
  }
}
