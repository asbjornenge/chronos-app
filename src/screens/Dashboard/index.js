import React, { Component } from 'react'
import { connect } from 'react-redux'
import './index.css'

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <div className="top">
          <input type="search" placeholder="Name Contains" />
          <div className="filterbuttons">
            <div 
              className={`filterbutton first ${this.props.filter === 'failing' ? 'selected' : ''}`} 
              onClick={this.updateFilter.bind(this, 'failing')}>
              <img src="/graphics/flame.svg" alt="flame" />
              <span>FAILING</span>
            </div>
            <div 
              className={`filterbutton ${this.props.filter === 'passing' ? 'selected' : ''}`} 
              onClick={this.updateFilter.bind(this, 'passing')}>
              <img src="/graphics/check.svg" alt="check" />
              <span>PASSING</span>
            </div>
            <div 
              className={`filterbutton last ${this.props.filter === 'pause' ? 'selected' : ''}`} 
              onClick={this.updateFilter.bind(this, 'pause')}>
              <img src="/graphics/pause.svg" alt="pause" />
              <span>PAUSED</span>
            </div>
          </div>
        </div>        
      </div>
    )
  }
  updateFilter(filter) {
    if (filter === this.props.filter) filter = ''
    this.props.updateFilter(filter)
  }
}

export default connect(
  (state) => {
    return {
      filter: state.app.dashboardFilter
    }
  },
  (dispatch) => {
    return {
      updateFilter: (filter) =>
        dispatch({
          type: 'SET_DASHBOARD_FILTER',
          filter: filter
        })
    }
  }
)(Dashboard)
