import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLockOpen } from '@fortawesome/free-solid-svg-icons'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './index.css'
export default class SecretListItem extends Component {
  render() {
    //let exec = getLastExec(this.props.Secret)
    return (
      <TableRow className={`SecretListItem ${this.props.selected ? 'selected' : ''}`} onClick={this.props.onClick}>
        <TableCell>
          <FontAwesomeIcon icon={faLockOpen} className='secretIcon'/>
          {this.props.secret.name}
        </TableCell>
        <TableCell align="right">
          {
            this.props.selected &&
            <img className="details img-clickable" src={`graphics/details.svg`} alt="details" onClick={this.editSecret.bind(this)} />
          }
        </TableCell>
      </TableRow>
    )
  }
  
  editSecret(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.editSecret(this.props.Secret)
  }
}
