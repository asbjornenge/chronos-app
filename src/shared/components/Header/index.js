import React, { Component } from 'react'
import { nav } from '../../utils'
import './index.css';

export default class Header extends Component {
  render() {
    return (
      <div className="App-header">
        <img alt="logo" src="graphics/logo.png" onClick={() => { nav('/') }} />
      </div>
    )
  }
}
