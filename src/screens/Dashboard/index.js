import React, { Component } from 'react'
import './index.css'

export default class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <div className="top">
          <input type="search" placeholder="Name Contains" />
          <div className="filterbuttons">
            <div className="filterbutton first">
              <img src="/graphics/flame.svg" alt="flame" />
              <span>FAILING</span>
            </div>
            <div className="filterbutton">
              <img src="/graphics/check.svg" alt="check" />
              <span>PASSING</span>
            </div>
            <div className="filterbutton last">
              <img src="/graphics/pause.svg" alt="pause" />
              <span>PAUSED</span>
            </div>
          </div>
        </div>        
      </div>
    )
  }
}
