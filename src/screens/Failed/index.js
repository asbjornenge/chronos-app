import React, { useState, useEffect } from 'react'
import FilterBar from '../../shared/components/FilterBar'
import './index.css'
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
import TopBar from '../../shared/components/TopBar'

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
        disabledStatus={['paused', 'passing', 'failing', 'run']}
        noAdd={true}
       />
      {props.children}
    </div>
  )
}

const Failed = (props) => {
  const [textFilter, setTextFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [failedExecs, setFailedExecs] = useState([])

  useEffect(() => {    
    api.getFailedExecs().then(e => setFailedExecs(e))
  }, [])

  let execList = failedExecs.filter(f => {
      if (textFilter === '') return true
      if (f.stepname.toLowerCase().indexOf(textFilter.toLowerCase()) >= 0) return true
      return false
    }).map(e => {
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
      <TopBar
          faIcon = {faBug}
          title = { "Failed steps" }
        > 
      </TopBar>
      <div className="FailedBody">
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

export default Failed