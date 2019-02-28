import React, { Component } from 'react'
import './index.css'

export default class Error extends Component {
  render() {
    let style = this.props.style || {}
    let imgStyle = this.props.imgStyle || {}
    return (
      <div className="Error" style={{...style}}>
        <img src="graphics/error.svg" alt="error" style={{...imgStyle}} />
        <span>{ this.props.message || 'Unknown error' }</span>
      </div>
    )
  }
}
