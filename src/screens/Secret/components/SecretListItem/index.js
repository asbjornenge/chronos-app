import React, { Component, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSecret, faCertificate, faLockOpen, faFish } from '@fortawesome/free-solid-svg-icons'

import './index.css'
export default class SecretListItem extends Component {
  render() {
    //let exec = getLastExec(this.props.Secret)
    return (
      <div className={`SecretListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        {
          <FontAwesomeIcon icon={faLockOpen} className='statusicon' />
        }
        <span>{this.props.secret.name}</span>
        <div className="spacer"></div>
        { this.props.selected &&
          <img className="details img-clickable" src={`graphics/details.svg`} alt="details" onClick={this.editSecret.bind(this)} />
        }
      </div>
    )
  }
  
  editSecret(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.editSecret(this.props.Secret)
  }
}
