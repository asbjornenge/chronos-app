import React, { Component } from 'react'
import './index.css'
import { toast } from 'react-toastify';
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
        <h2>Edit {this.props.secret.name}</h2>
        }
        <form ref="form" className="SecretForm" onSubmit={this.submit.bind(this)}>
          <div>
            <label htmlFor="name">Name</label>
            <input className="first" type="text" name="name" id="name" required 
              placeholder="Name of Secret"
              value={this.state.name || ''} 
              onChange={this.handleChange.bind(this, 'name')} 
            />
          </div>
          <div>
            <label htmlFor="secretvalue">Value</label>
            <input type="text" name="secretvalue" id="secretvalue" required 
              placeholder="Value"
              value={this.state.secretvalue} 
              onChange={this.handleChange.bind(this, 'secretvalue')} 
            />
          </div>
          <br/>
          <div>
            <label htmlFor="usage">Usage</label>
            <span name="usage" id="clickable" onClick={() => {
                toast.promise(navigator.clipboard.writeText('{{' + this.state.name + '}}'),
                {
                  pending: "Copying...",
                  success: "Copied to clipboard!",
                  error: "Failed to copy to clipboard!"
                })
              }}>
              {
                '{{' + this.state.name + '}}'
              }
            </span>
          </div>
        </form>
        <div className="buttons">
          <button className='btn btn-green' onClick={this.submit.bind(this)}>Save</button>
          <button className='btn btn-orange' onClick={this.cancel.bind(this)}>Cancel</button>
          <div className="spacer"></div>
          { this.props.secret.id !== 0 &&
          <button className='btn btn-red' onClick={this.delete.bind(this)}>Delete</button>
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
