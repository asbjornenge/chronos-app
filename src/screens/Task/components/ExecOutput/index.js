import React, { Component } from 'react'
import './index.css'

export default class ExecOutut extends Component {
  state = {
    output: 'stdout'
  }
  render() {
    return (
      <div className="ExecOutput">
        <div className="OutputSelector">
          <div className={`${this.state.output === 'stdout' ? 'selected' : ''}`} onClick={() => {this.setState({ output: 'stdout' })}}>stdout</div>
          <div className={`${this.state.output === 'stderr' ? 'selected' : ''}`} onClick={() => {this.setState({ output: 'stderr' })}}>stderr</div>
        </div>
        <div className="output">
          <pre>{this.props.exec[this.state.output]}</pre>
        </div>
      </div>
    )
  }
}
