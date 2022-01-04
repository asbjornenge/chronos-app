import React, { Component } from 'react'
import './index.css'

const DEFAULT_SORT_ORDER = 1
const DEFAULT_TIMEOUT = 5000

export default class SecretForm extends Component {
  state = {
    name: '',
    secrettype: '' || "string", 
    secretvalue: '',
  }

  render() {
    console.log("state",this.state)
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
            <label htmlFor="secrettype">Type</label>
            <input type="text" name="secrettype" id="secrettype" required 
              placeholder="Type"
              value={this.state.secrettype || ''} 
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
    if (!this.state.command || this.state.command.length === 0) return
    if (!this.state.timeout) return
    this._readyForProps = true
    this.props.onSubmit(this.state, this.props.secret)
  }
  handleChange(field, e) {
    let update = {}
    update[field] = e.target.value
    this.setState(Object.assign(this.state, update))
  }
  setStateFromSecret(secret) {
    let { id, name, secrettype, secretvalue } = secret
    this.setState(Object.assign({id, name, secrettype, secretvalue}))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.secret.id !== this.props.secret.id)
      this.setStateFromSecret(nextProps.secret)
  }
  componentDidMount() {
    console.log("Props", this.props)
    this.setStateFromSecret(this.props.secret)
  } 
}
