import React, { useState, useRef, useEffect } from 'react'
import moment from 'moment'
import { nav } from '../../../../shared/utils'
import './index.css'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import * as Parser from 'cron-parser'

const TaskListItem = (props) => {
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

  props.task.last?.forEach(e => {
    if (timestamp === null) timestamp = moment(e)
    else if (moment(e) > timestamp) timestamp = moment(e)
  })
  let name,cron = null
  
  if (!editing && !adding) {
    name = <span className="name">{`${props.task.name} (${props.task.steps.length})`}</span>
    cron = <span className="cron">{props.task.cron || "-"}</span>
  } else {
    name = ( 
      <span className="name" onClick={(e) => e.stopPropagation()}>
        <input ref={taskname} type="text" placeholder="Task name" className='NameInput' defaultValue={props.task.name} />
      </span>
    )
    cron = ( 
      <span className="cron" onClick={(e) => e.stopPropagation()}>
        <input ref={taskcron} type="text" placeholder="Task cron" className="CronInput" defaultValue={props.task.cron} />
      </span>
    )

  }

  let next
  if (props.task.cron && !props.task.paused) {
    try {
      next = moment(Parser.parseExpression(props.task.cron).next().toISOString()).fromNow()
    }
    catch {
      next = ""
    }
  }
  else {
    next = ""
  }

  return (
    <TableRow
    key={props.task.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    onClick={() => nav(`/task/${props.task.id}`)}
    className={"TaskListItem"}
  >
    <TableCell component="th" scope="row">
      <img src={`graphics/${props.task.status}.svg`} alt={props.task.status} />
      {name}
    </TableCell>
    <TableCell align="right">{cron}</TableCell>
    <TableCell align="right">{next}</TableCell>
    <TableCell align="right">{timestamp ? timestamp.fromNow() : 'Never'}</TableCell>
    <TableCell align="right">{
      <span className="editbuttons">
        { (editing || adding) &&
          <img src={`graphics/save.svg`} alt="save" onClick={saveTask} />
        }
        <img src={`graphics/edit-white.svg`} alt="edit" onClick={(e) => {e.stopPropagation(); setEditing(!editing)}} />
        <img src={`graphics/trash.svg`} alt="remove" onClick={removeTask} />
      </span>
    }</TableCell>
  </TableRow>
  )
}

export default TaskListItem