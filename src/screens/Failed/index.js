import React, { useState, useEffect } from 'react'
import FilterBar from '../../shared/components/FilterBar'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug } from '@fortawesome/free-solid-svg-icons'
import * as api from '../../shared/api'
import moment from 'moment'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const FailedWrapper = (props) => {
  return (
    <div className="Failed">
      <FilterBar 
        placeholder="Exec" 
        type="exec"
        textFilter={props.textFilter}
        setTextFilter={props.setTextFilter}
        statusFilter={props.statusFilter}
        setStatusFilter={props.setStatusFilter}
        disabledStatus={['paused', 'passing', 'failing']}
       />
      {props.children}
    </div>
  )
}

export default (props) => {
  const [textFilter, setTextFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [failedExecs, setFailedExecs] = useState([])

  useEffect(() => {    
    api.getFailedExecs().then(e => setFailedExecs(e))
  }, [])

  let execList = failedExecs.map(e => {
    // return (
    //   <div className='FailedExec'>
        
    //     <div className='FailedButton'>{e.taskid}</div>

    //     <div className='FailedDate'>{moment(e.time_end).fromNow()}</div>
    //   </div>
    // )

    return (<TableRow
    key={e.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell component="th" scope="row">
      {e.stepname}
    </TableCell>
    <TableCell align="right">{e.taskname}</TableCell>
    <TableCell align="right">{(moment(e.time_end).fromNow())}</TableCell>
    <TableCell align="right">{e.exitcode}</TableCell>
    <TableCell align="right"><a href={`/#/task/${e.taskid}/step/${e.stepid}`}>Show</a></TableCell>
  </TableRow>
  )
  })


  return (
    <FailedWrapper 
      textFilter={textFilter}
      setTextFilter={setTextFilter}
      statusFilter={statusFilter}
      setStatusFilter={(status) => {
        let _status = status === statusFilter ? '' : status
        setStatusFilter(_status)
        }}
    >
      <div className="FailedBody">
        <div className="top">
          <FontAwesomeIcon icon={faBug}/>
          <h1>Failed executions</h1>
          <div className="spacer"></div>
        </div>
        <div className="FailedInfoWrapper">
          <div className="FailedList">
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Step</TableCell>
                    <TableCell align='right'>Task</TableCell>
                    <TableCell align='right'>When</TableCell>
                    <TableCell align='right'>ExitCode</TableCell>
                    <TableCell align='right'>Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {execList}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </FailedWrapper>
  )
}
//  async togglePause() {
//    let res = await fetch(`${window.apihost}/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify({ paused: !task.paused}) })
//    if (!res.ok) return
//    props.dispatch(rest.actions.task.reset())
//    props.dispatch(rest.actions.task.sync({id:task.id, steps:true, execs:10}))
//  }
//}