import React, { Component } from 'react'
import { getStepStatus } from '../../../../shared/utils'
import './index.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export default class StepListItem extends Component {
  render() {
    let status = getStepStatus(this.props.step)
    //let exec = getLastExec(this.props.step)
    return (
      <TableRow className={`StepListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <TableCell>
          <img src={`graphics/${status}.svg`} alt={status} />
          {this.props.step.name}
        </TableCell>
        <TableCell align={"right"}>
          {this.props.selected &&
            status === "run" ?
            <img className='wait' src={`graphics/wait.svg`} alt="wait" />: null
            
          }
          {
            this.props.selected &&
            status !== "run" ? 
            <img className='run img-clickable' src={`graphics/play.svg`} alt="run" onClick={this.runStep.bind(this)} />: null
          }
          { this.props.selected &&
            <img className="details img-clickable" src={`graphics/details.svg`} alt="details" onClick={this.editStep.bind(this)} />
          }
        </TableCell>
      </TableRow>
    )
  }
  
  editStep(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.editStep(this.props.step)
  }
  runStep(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.runStep(this.props.step)
  }
}
