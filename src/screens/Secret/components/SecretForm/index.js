import React, { Component } from 'react'
import './index.css'
import { toast } from 'react-toastify';
import { TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
export default class SecretForm extends Component {
  state = {
    name: '',
    secretvalue: '',
  }

  render() {
    return (
      <div className="SecretForm">
        { !this.props.secret.name &&
        <h2>Add Secret</h2>
        }
        { this.props.secret.name &&
        <h2>Editing {this.props.secret.name}</h2>
        }
        <form ref="form" className="SecretForm" onSubmit={this.submit.bind(this)}>
          <TextField id="name" label="Name" required variant='outlined' value={this.state.name || ''} onChange={this.handleChange.bind(this, 'name')} ></TextField> 
          <TextField id="secretvalue" label="Value" required variant='outlined' value={this.state.secretvalue} onChange={this.handleChange.bind(this, 'secretvalue')} ></TextField>
          <br/>
          <TextField id="usage" label="Usage" value={'{{' + this.state.name + '}}'} disabled onClick={() => {
            toast.promise(navigator.clipboard.writeText('{{' + this.state.name + '}}'),
            {
              pending: "Copying...",
              success: "Copied to clipboard!",
              error: "Failed to copy to clipboard!"
            })
          }}/>
        </form>
        <div className="buttons">
          <Button onClick={this.submit.bind(this)} variant="outlined" color="success">Save</Button>
          <Button onClick={this.cancel.bind(this)} variant="outlined" id="CancelButton" color="warning">Cancel</Button>
          <div className="spacer"></div>
          { this.props.secret.id !== 0 &&
          <Button onClick={this.delete.bind(this)} variant="outlined" color="error">Delete</Button>
          }
        </div>
      </div>
    )
  }
  delete() {
    this.props.onDelete(this.props.secret)
  }
  submit() {
    if (!this.state.name || this.state.name.length === 0) return
    if (!this.state.secretvalue || this.state.secretvalue.length === 0) return
    this._readyForProps = true
    this.props.onSubmit(this.state, this.props.secret)
  }
  
  cancel() {
    this.props.onCancel(this.props.secret)
  }
  handleChange(field, e) {
    let update = {}
    update[field] = e.target.value
    this.setState(Object.assign(this.state, update))
  }
  setStateFromSecret(secret) {
    let { id, name } = secret
    let secretvalue = "UNCHANGED"
    this.setState(Object.assign({id, name, secretvalue}))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.secret.id !== this.props.secret.id)
      this.setStateFromSecret(nextProps.secret)
  }
  componentDidMount() {
    this.setStateFromSecret(this.props.secret)
  } 
}
