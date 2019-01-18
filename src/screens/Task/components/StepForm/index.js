import React, { Component } from 'react'
import './index.css'

export default class StepForm extends Component {
  state = {
    name: '',
    command: '',
    timeout: 0
  }
  render() {
    return (
      <form ref="form" className="StepForm" onSubmit={this.submit.bind(this)}>
        <div>
          <label htmlFor="name">Name</label>
          <input className="first" type="text" name="name" id="name" required 
            placeholder="Name of step"
            value={this.state.name} 
            onChange={this.handleChange.bind(this, 'name')} 
          />
        </div>
        <div>
          <label htmlFor="command">Command</label>
          <input type="text" name="command" id="command" required 
            placeholder="Command to run"
            value={this.state.command} 
            onChange={this.handleChange.bind(this, 'command')} 
          />
        </div>
        <div>
          <label htmlFor="timeout">Timeout</label>
          <input className="last" type="number" name="timeout" id="timeout" required 
            placeholder="Execution timeout"
            value={this.state.timeout} 
            onChange={this.handleChange.bind(this, 'timeout')}
          />
        </div>
      </form>
    )
  }
  submit() {
    console.log('submitting', this.state)
  }
  handleChange(field, e) {
    let update = {}
    update[field] = e.target.value
    this.setState(Object.assign(this.state, update))
  }
  componentDidMount() {
    let { id, name='', command, timeout } = this.props.step
    this.setState(Object.assign({id, name, command, timeout}))
  } 
}
