import React, { useState, useRef, useEffect } from 'react'
import moment from 'moment'
import { nav } from '../../../../shared/utils'
import './index.css'

export default (props) => {
  let [editing, setEditing] = useState(false)
  let adding = props.task.id === 0
  let timestamp = null
  let taskname = useRef('')
  let taskcron = useRef('')

  useEffect(() => {
    if (props.task.id === 0)
      taskname.current.focus()
  })

  let saveTask = (e) => {
    e.stopPropagation()
    let name = taskname.current.value
    let cron = taskcron.current.value
    props.saveTask({ id: props.task.id, name: name, cron: cron})
    setEditing(false)
  }

  let removeTask = (e) => {
    e.stopPropagation()
    let res = window.confirm('Are you sure?')
    if (res) props.removeTask(props.task)
  }

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
        <input ref={taskname} type="text" placeholder="Task name" defaultValue={props.task.name} />
      </span>
    )
    cron = ( 
      <span className="cron" onClick={(e) => e.stopPropagation()}>
        <input ref={taskcron} type="text" placeholder="Task cron" defaultValue={props.task.cron} />
      </span>
    )
  }
  return (
    <div className="TaskListItem" onClick={() => nav(`/task/${props.task.id}`)}>
      <img src={`graphics/${props.task.status}.svg`} alt={props.task.status} />
      {name}
      <span className="spacer"></span>
      <span className="editbuttons">
        { (editing || adding) &&
          <img src={`graphics/save.svg`} alt="save" onClick={saveTask} />
        }
        <img src={`graphics/edit.svg`} alt="edit" onClick={(e) => {e.stopPropagation(); setEditing(!editing)}} />
        <img src={`graphics/trash.svg`} alt="remove" onClick={removeTask} />
      </span>
      {cron} 
      <span className="lastrun">{timestamp ? timestamp.fromNow() : 'Never'}</span>
    </div>
  )
}
