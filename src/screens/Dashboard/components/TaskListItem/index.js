import React, { useState } from 'react'
import moment from 'moment'
import { nav } from '../../../../shared/utils'
import './index.css'

export default (props) => {
  let [editing, setEditing] = useState(false)
  let adding = props.task.id === 0
  let timestamp = null
  props.task.steps.forEach(s => {
    s.execs.forEach(e => {
      if (timestamp === null) timestamp = moment(e.time_end)
      else if (moment(e.time_end) > timestamp) timestamp = moment(e.time_end)
    })
  })
  let name,cron = null
  if (!editing && !adding) {
    name = <span className="name">{`${props.task.name} (${props.task.steps.length})`}</span>
    cron = <span className="cron">{props.task.cron || "-"}</span>
  } else {
    name = ( 
      <span className="name" onClick={(e) => e.stopPropagation()}>
        <input ref="taskname" type="text" placeholder="Task name" defaultValue={props.task.name} />
      </span>
    )
    cron = ( 
      <span className="cron" onClick={(e) => e.stopPropagation()}>
        <input ref="taskcron" type="text" placeholder="Task cron" defaultValue={props.task.cron} />
      </span>
    )
  }
  return (
    <div className="TaskListItem" onClick={() => this.openTaskDetails.bind(this)}>
      <img src={`graphics/${props.task.status}.svg`} alt={props.task.status} />
      {name}
      <span className="spacer"></span>
      <span className="editbuttons">
        { (editing || adding) &&
          <img src={`graphics/save.svg`} alt="save" onClick={() => this.saveTask.bind(this)} />
        }
        <img src={`graphics/edit.svg`} alt="edit" onClick={() => this.editTask.bind(this)} />
        <img src={`graphics/trash.svg`} alt="remove" onClick={() => this.removeTask.bind(this)} />
      </span>
      {cron} 
      <span className="lastrun">{timestamp ? timestamp.fromNow() : 'Never'}</span>
    </div>
  )
//  saveTask(e) {
//    e.stopPropagation()
//    this.setState({ editing: false })
//    let name = this.refs.taskname.value
//    let cron = this.refs.taskcron.value
//    props.saveTask({ id: props.task.id, name: name, cron: cron})
//  }
//  editTask(e) {
//    e.stopPropagation();
//    this.setState({ editing: !this.state.editing })
//  }
//  removeTask(e) {
//    e.stopPropagation();
//    let res = window.confirm('Are you sure?')
//    if (res) props.removeTask(props.task)
//  }
//  openTaskDetails() {
//    nav(`/task/${props.task.id}`)
//  }
//  componentDidMount() {
//    if (props.task.id === 0)
//      this.refs.taskname.focus()
//  }
}
