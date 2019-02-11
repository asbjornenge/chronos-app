import React, { Component } from 'react'
import { connect } from 'react-redux'
import TaskListItem from './components/TaskListItem'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import { setTaskStatus } from '../../shared/utils'
import rest from '../../store/rest'
import './index.css'

const addTask = {
  id: 0,
  name: '',
  paused: true,
  steps: []
}

class Dashboard extends Component {
  state = {
    adding: false
  }
  render() {
    let _tasks = []
    if (this.props.tasks.data.data) _tasks = _tasks.concat(this.props.tasks.data.data) 
    if (this.state.adding) _tasks = [addTask].concat(_tasks)
    let tasks = _tasks 
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
        return (
          <TaskListItem 
            key={t.id} 
            task={t}
            saveTask={this.saveTask.bind(this)} 
            removeTask={this.removeTask.bind(this)} 
          />
        )
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
        <FilterBar placeholder="Task name" type="task" onAddClick={this.toggleAddTask.bind(this)} />
        <div className={error ? "TaskListItemsError" : "TaskListItems"}>
          {tasks}
        </div> 
      </div>
    )
  }
  saveTask(task) {
    if (task.name.length === 0 || task.name === ' ') return
    if (task.id !== 0) return this.updateTask(task)
    delete task.id
    this.props.dispatch(rest.actions.tasks.post({}, { body: JSON.stringify(task) }, (err, data) => {
      if (err) return console.error(err)
      this.props.dispatch(rest.actions.dashboard.reset())
      this.props.dispatch(rest.actions.dashboard.sync())
      this.setState({ adding: false }) 
    }))
  }
  updateTask(task) {
    this.props.dispatch(rest.actions.task.put({ id: task.id }, { body: JSON.stringify(task) }, (err, data) => {
      if (err) return console.error(err)
      this.props.dispatch(rest.actions.task.reset())
      this.props.dispatch(rest.actions.dashboard.reset())
      this.props.dispatch(rest.actions.dashboard.sync())
      this.setState({ adding: false }) 
    }))
  }
  removeTask(task) {
    let payload = { id: task.id }
    this.props.dispatch(rest.actions.task.delete(payload, (err, data) => {
      if (err) return console.error(err)
      this.props.dispatch(rest.actions.dashboard.reset())
      this.props.dispatch(rest.actions.dashboard.sync())
    }))
  }
  toggleAddTask() {
    this.setState({ adding: !this.state.adding })
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
