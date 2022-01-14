import React, { Component } from 'react'
import './index.css'

const DEFAULT_SORT_ORDER = 1
const DEFAULT_TIMEOUT = 5000

export default class StepForm extends Component {
  state = {
    name: '',
    command: '',
    sort_order: DEFAULT_SORT_ORDER,
    timeout: DEFAULT_TIMEOUT
  }
  render() {
    return (
      <div className="StepForm">
        { !this.props.step.name &&
        <h2>Add step</h2>
        }
        { this.props.step.name &&
        <h2>Edit {this.props.step.name}</h2>
        }
        <form ref="form" className="StepForm" onSubmit={this.submit.bind(this)}>
          <div>
            <label htmlFor="name">Name</label>
            <input className="first" type="text" name="name" id="name" required 
              placeholder="Name of step"
              value={this.state.name || ''} 
              onChange={this.handleChange.bind(this, 'name')} 
            />
          </div>
          <div>
            <label htmlFor="command">Command</label>
            <input type="text" name="command" id="command" required 
              placeholder="Command to run"
              value={this.state.command || ''} 
              onChange={this.handleChange.bind(this, 'command')} 
            />
          </div>
          <div>
            <label htmlFor="order">Order</label>
            <input className="last" type="number" name="order" id="order" required 
              placeholder="Execution order"
              value={this.state.sort_order || DEFAULT_SORT_ORDER} 
              onChange={this.handleChange.bind(this, 'sort_order')}
            />
          </div>
          <div>
            <label htmlFor="timeout">Timeout</label>
            <input className="last" type="number" name="timeout" id="timeout" required 
              placeholder="Execution timeout"
              value={this.state.timeout || DEFAULT_TIMEOUT} 
              onChange={this.handleChange.bind(this, 'timeout')}
            />
          </div>
        </form>
        <div className="buttons">
          <button className='btn btn-green' onClick={this.submit.bind(this)}>Save</button>
          <button className='btn btn-orange' onClick={this.props.onCancel}>Cancel</button>
          <div className="spacer"></div>
          { this.props.step.id !== 0 &&
          <button className='btn btn-red' onClick={this.delete.bind(this)}>Delete</button>
          }
        </div>
      </div>
    )
  }
  delete() {
    this.props.onDelete(this.props.step)
  }
  submit() {
    if (!this.state.name || this.state.name.length === 0) return
    if (!this.state.command || this.state.command.length === 0) return
    if (!this.state.timeout) return
    this._readyForProps = true
    this.props.onSubmit(this.state, this.props.step)
  }
  handleChange(field, e) {
    let update = {}
    update[field] = e.target.value
    this.setState(Object.assign(this.state, update))
  }
  setStateFromStep(step) {
    let { id, name, command, sort_order, timeout } = step
    if (!sort_order) sort_order = this.props.numSteps+1
    if (!timeout) timeout = DEFAULT_TIMEOUT 
    this.setState(Object.assign({id, name, command, sort_order, timeout}))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.step.id !== this.props.step.id)
      this.setStateFromStep(nextProps.step)
  }
  componentDidMount() {
    this.setStateFromStep(this.props.step)
  } 
}
