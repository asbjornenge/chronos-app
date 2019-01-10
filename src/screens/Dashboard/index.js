import React, { Component } from 'react'
import { connect } from 'react-redux'
import TaskListItem from './components/TaskListItem'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import { setTaskStatus } from '../../shared/utils'
import rest from '../../store/rest'
import './index.css'

class Dashboard extends Component {
  render() {
    let tasks = (this.props.tasks.data.data || []) 
      .map(setTaskStatus)
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
    let error = (this.props.tasks.loading || this.props.tasks.error != null)
    if (error) {
      tasks = <Loading style={{flex:'auto', width: 200, height: 200}} />
    }
    if (this.props.tasks.error != null) {
      tasks = <Error message={this.props.tasks.error.message} />
    }
    return (
      <div className="Dashboard">
        <FilterBar />
        <div className={error ? "TaskListItemsError" : "TaskListItems"}>
          {tasks}
        </div> 
      </div>
    )
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
      dispatch: dispatch
    }
  }
)(Dashboard)
