import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FileIcon } from 'react-file-icon';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

import './index.css'
import { TableCell, TableRow } from '@mui/material';
export default class FileListItem extends Component {
  
  addtoClip(e) {
    e.preventDefault()
    e.stopPropagation()
    toast.promise(navigator.clipboard.writeText(this.props.file.fullname),
    {
      pending: "Copying...",
      success: "Copied to clipboard!",
      error: "Failed to copy to clipboard!"
    })
  }

  deleteFile(e) {
    e.preventDefault()
    e.stopPropagation()
    confirmAlert({
      title: 'Confirm delete',
      message: 'Are you sure you want to permamently delete ' + this.props.file.fullname + '?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.props.onDelete(this.props.file)
        },
        {
          label: 'No',
        }
      ]
    });  
  }

  render() {
    //let exec = getLastExec(this.props.Secret)
    let ext = this.props.file.name.split(".").at(-1)
    return (
      <TableRow className={`FileListItem ${this.props.selected ? 'selected' : ''}`}>
        <TableCell>
          <div className='flexmebruv'>
            <div className='FileIconContainer'>
              <FileIcon extension={ext.length > 0 && ext.length < 4 ? ext : "N/A"}/>
            </div>
            <span className='FileName'>{this.props.file.subfolder}/</span>
            <span className='FileNameSub'> {this.props.file.name}</span>
          </div>
        </TableCell>
        <TableCell align="right">
          <FontAwesomeIcon icon={faClipboard} onClick={this.addtoClip.bind(this)} className="FileListIcon"/>
          {/* <div className='minispacer'></div> */}
          <FontAwesomeIcon icon={faTrash} onClick={this.deleteFile.bind(this)} className="FileListIcon"/>
        </TableCell>
      </TableRow>
      
    )
  }
  
}
