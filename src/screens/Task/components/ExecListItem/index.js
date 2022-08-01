import React, { Component } from 'react'
import moment from 'moment'
import './index.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default class ExecListItem extends Component {
  render() {
    let status = this.props.exec.exitcode === 0 ? 'passing' : 'failing'
    status = this.props.exec.completed ? status: 'run'
    let date = moment(this.props.exec.time_start).format('DD-MM-YYYY')
    let start = moment(this.props.exec.time_start).format('HH:mm:ss')
    let end = moment(this.props.exec.time_end).format('HH:mm:ss')
    let diff = moment(this.props.exec.time_end).diff(this.props.exec.time_start, 'seconds')
    return (
      <TableRow className={`ExecListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <TableCell align="right">
          <span className='ExecSpan'>
            <img src={`graphics/${status}.svg`} alt={status} width="50px"/>
            <span className="date">{date}</span>
            <span className="meta">from</span><span className="date">{start}</span>
            {
              this.props.exec.completed &&
              <span>
                <span className="meta">to</span><span className="date">{end}</span>
                <span className="meta">for</span><span className="date">{diff+'s'}</span>
              </span>
            }
            
          </span>
        </TableCell>
      </TableRow>
    )
  }
}
