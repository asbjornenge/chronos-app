import React, { Component } from 'react'
import { connect } from 'react-redux'

class Task extends Component {
  render() {
    return (
      <div>This is task {this.props.id}</div>
    )
  }
}

export default connect(
  (state) => {
    return {
      tasks: state.tasks
    }
  },
)(Task)
