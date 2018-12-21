import React, { Component } from 'react'
import { connect } from 'react-redux'
import TaskListItem from './components/TaskListItem'
import { 
  SET_DASHBOARD_FILTER, 
  SET_DASHBOARD_NAME_FILTER
} from '../../store/reducers'
import rest from '../../store/rest'
import './index.css'

const taskList = [
  {
    status: 'passing',
    name: 'TagHub Postgresql Backup (core)',
    timestamp: new Date().getTime(),
    numberOfSteps: 2,
    id: 1
  },
  {
    status: 'paused',
    name: 'TagHub Postgresql Backup (events)',
    timestamp: new Date().getTime()-100000,
    numberOfSteps: 2,
    id: 2
  },
  {
    status: 'failing',
    name: 'Gitlab Backup',
    timestamp: new Date().getTime()-10000000,
    numberOfSteps: 4,
    id: 3
  },
  {
    status: 'passing',
    name: 'Elasticsearch Backup (es1)',
    timestamp: new Date().getTime(),
    numberOfSteps: 1,
    id: 4
  }
]

class Dashboard extends Component {
  render() {
    let tasks = (this.props.tasks.data.data || []) 
      .filter(t => {
        if (this.props.filter === '') return true
        if (this.props.filter === t.status) return true
        return false
      })
      .filter(t => {
        if (this.props.nameFilter === '') return true
        if (t.name.toLowerCase().indexOf(this.props.nameFilter.toLowerCase()) >= 0) return true
        return false
      })
      .map(t => {
        return <TaskListItem key={t.id} task={t} />
      })
    return (
      <div className="Dashboard">
        <div className="top">
          <input 
            type="search" 
            value={this.props.nameFilter}
            onChange={this.updateNameFilter.bind(this)}
            placeholder="Task Name" />
          <div className="filterbuttons">
            <div 
              className={`filterbutton first ${this.props.filter === 'failing' ? 'selected' : ''}`} 
              onClick={this.updateFilter.bind(this, 'failing')}>
              <img src="/graphics/failing.svg" alt="failing" />
              <span>FAILING</span>
            </div>
            <div 
              className={`filterbutton ${this.props.filter === 'passing' ? 'selected' : ''}`} 
              onClick={this.updateFilter.bind(this, 'passing')}>
              <img src="/graphics/passing.svg" alt="passing" />
              <span>PASSING</span>
            </div>
            <div 
              className={`filterbutton ${this.props.filter === 'paused' ? 'selected' : ''}`} 
              onClick={this.updateFilter.bind(this, 'paused')}>
              <img src="/graphics/paused.svg" alt="paused" />
              <span>PAUSED</span>
            </div>
            <div 
              className={`filterbutton last add`}> 
              <img src="/graphics/add-white.svg" alt="add" />
            </div>
          </div>
        </div>
        <div className="TaskListItems">
          {tasks}
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
  componentDidMount() {
    this.props.dispatch(rest.actions.dashboard.sync())
  }
}

export default connect(
  (state) => {
    return {
      tasks: state.dashboard,
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
      },
      dispatch: dispatch
    }
  }
)(Dashboard)
