import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  SET_DASHBOARD_FILTER, 
  SET_DASHBOARD_NAME_FILTER
} from '../../../store/reducers'
import './index.css'

class FilterBar extends Component {
  render() {
    return (
      <div className="FilterBar">
        <input 
          type="search" 
          value={this.props.nameFilter}
          onChange={this.updateNameFilter.bind(this)}
          placeholder={this.props.placeholder || ''} />
        <div className="filterbuttons">
          <div 
            className={`filterbutton first ${this.props.filter === 'failing' ? 'selected' : ''}`} 
            onClick={this.updateFilter.bind(this, 'failing')}>
            <img src="graphics/failing.svg" alt="failing" />
            <span>FAILING</span>
          </div>
          <div 
            className={`filterbutton ${this.props.filter === 'passing' ? 'selected' : ''}`} 
            onClick={this.updateFilter.bind(this, 'passing')}>
            <img src="graphics/passing.svg" alt="passing" />
            <span>PASSING</span>
          </div>
          <div 
            className={`filterbutton ${this.props.filter === 'paused' ? 'selected' : ''}`} 
            onClick={this.updateFilter.bind(this, 'paused')}>
            <img src="graphics/paused.svg" alt="paused" />
            <span>PAUSED</span>
          </div>
          <div 
            onClick={this.props.onAddClick}
            className={`filterbutton last add ${this.props.type || ''}`}> 
            <img src="graphics/add-white.svg" alt="add" />
          </div>
        </div>
      </div>
    )
  }
  updateFilter(filter) {
    if (filter === this.props.filter) filter = ''
    this.props.updateFilter(filter)
  }
  updateNameFilter(e) {
    this.props.updateNameFilter(e.target.value)
  }
}

export default connect(
  (state) => {
    return {
      filter: state.app.dashboardFilter,
      nameFilter: state.app.dashboardNameFilter
    }
  },
  (dispatch) => {
    return {
      updateFilter: (filter) => {
        return dispatch({
          type: SET_DASHBOARD_FILTER,
          filter: filter
        })
      },
      updateNameFilter: (filter) => {
        return dispatch({
          type: SET_DASHBOARD_NAME_FILTER,
          filter: filter
        })
      }
    }
  }
)(FilterBar)
