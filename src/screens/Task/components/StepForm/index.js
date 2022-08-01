import React, { Component } from 'react'
import './index.css'
import { TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

const DEFAULT_SORT_ORDER = 1
const DEFAULT_TIMEOUT = 5000

export default class StepForm extends Component {
  state = {
    name: '',
    command: '',
    sort_order: DEFAULT_SORT_ORDER,
    timeout: DEFAULT_TIMEOUT,
    stdoutregex: null
  }
  render() {
    return (
      <div className="StepForm">
        { !this.props.step.name &&
        <h2>Add step</h2>
        }
        { this.props.step.name &&
        <h2>Editing {this.props.step.name}</h2>
        }
        <form ref="form" className="StepForm" onSubmit={this.submit.bind(this)}>
          <TextField id="name" label="Name" className='first' variant="outlined" required value={this.state.name} onChange={this.handleChange.bind(this, 'name')}/>
          <TextField id="command" label="Command" multiline variant="outlined" required value={this.state.command || ''} onChange={this.handleChange.bind(this, 'command')}/>
          <TextField id="order" label="Order" type="number" variant="outlined" required value={this.state.sort_order || DEFAULT_SORT_ORDER} onChange={this.handleChange.bind(this, 'sort_order')}/>
          <TextField id="timeout" label="Timeout" type="number" variant="outlined" required value={this.state.timeout || DEFAULT_TIMEOUT} onChange={this.handleChange.bind(this, 'timeout')} />
          <TextField id="stdoutregex" label="Regex" variant="outlined" value={this.state.stdoutregex || ''} onChange={this.handleChange.bind(this, 'stdoutregex')}/>
        </form>
        <div className="buttons">
          <Button onClick={this.submit.bind(this)} variant="outlined" color="success">Save</Button>
          <Button onClick={this.props.onCancel} variant="outlined" id="CancelButton" color="warning">Cancel</Button>
          <div className="spacer"></div>
          { this.props.step.id !== 0 &&
          <Button onClick={this.delete.bind(this)} variant="outlined" color="error">Delete</Button>
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
    let { id, name, command, sort_order, timeout, stdoutregex } = step
    if (!sort_order) sort_order = this.props.numSteps+1
    if (!timeout) timeout = DEFAULT_TIMEOUT 
    this.setState(Object.assign({id, name, command, sort_order, timeout, stdoutregex}))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.step.id !== this.props.step.id)
      this.setStateFromStep(nextProps.step)
  }
  componentDidMount() {
    this.setStateFromStep(this.props.step)
  } 
}
