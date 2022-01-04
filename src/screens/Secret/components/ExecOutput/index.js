import React, { Component } from 'react'
import './index.css'

export default class ExecOutut extends Component {
  state = {
    output: 'stdout'
  }
  render() {
    var stdout_len = '', stderr_len = ''
    if (typeof this.props.exec.stdout === 'string' && this.props.exec.stdout.length > 0) stdout_len = '*' 
    if (typeof this.props.exec.stderr === 'string' && this.props.exec.stderr.length > 0) stderr_len = '*' 
    return (
      <div className="ExecOutput">
        <div className="OutputSelector">
          <div className={`${this.state.output === 'stdout' ? 'selected' : ''}`} onClick={() => {this.setState({ output: 'stdout' })}}>
            {`stdout ${stdout_len}`}
          </div>
          <div className={`${this.state.output === 'stderr' ? 'selected' : ''}`} onClick={() => {this.setState({ output: 'stderr' })}}>
            {`stderr ${stderr_len}`}
          </div>
        </div>
        <div className="output">
          <pre>{this.props.exec[this.state.output]}</pre>
        </div>
      </div>
    )
  }
}
