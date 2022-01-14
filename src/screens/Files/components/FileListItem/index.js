import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FileIcon } from 'react-file-icon';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

import './index.css'
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
          onClick: () => this.props.onDelete(this.props.file.name)
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
      <div className={`FileListItem ${this.props.selected ? 'selected' : ''}`}>
        <div className='itemcontainer'>
          <FileIcon extension={ext.length > 0 && ext.length < 4 ? ext : "N/A"} />
        </div>
        <span className='filename'>{this.props.file.fullname}</span>
        <div className="spacer"></div>
        <FontAwesomeIcon icon={faClipboard} onClick={this.addtoClip.bind(this)} className='filelisticon'/>
        <div className='minispacer'></div>
        <FontAwesomeIcon icon={faTrash} onClick={this.deleteFile.bind(this)} className='filelisticon'/>
      </div>
    )
  }
  
}
