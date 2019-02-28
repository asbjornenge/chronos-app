import React, { Component } from 'react'
import './index.css'

export default class Loading extends Component {
  render() {
    let style = this.props.style || {}
    let imgStyle = this.props.imgStyle || style
    return (
      <div className="Loading" style={{...style}}>
        <img src="graphics/rings.svg" alt="loading" style={{...imgStyle}} />
      </div>
    )
  }
}
