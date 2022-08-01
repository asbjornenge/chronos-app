import React, { useState } from 'react'
import { useFiles } from '../../shared/hooks'
import FilterBar from '../../shared/components/FilterBar'
import './index.css'
import { faFileCode } from '@fortawesome/free-solid-svg-icons'
import * as api from '../../shared/api'
import FileListItem from './components/FileListItem'
import FileForm from './components/FileForm'
import TopBar from '../../shared/components/TopBar'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';

const Filewrapper = (props) => {
  return (
    <div className="Files">
      <FilterBar 
        placeholder="File name" 
        type="file"
        textFilter={props.textFilter}
        setTextFilter={props.setTextFilter}
        statusFilter={props.statusFilter}
        setStatusFilter={props.setStatusFilter}
        onAddClick={props.toggleAddFile}
        disabledStatus={['paused', 'passing', 'failing', 'run']}
        noAdd={true}
       />
      {props.children}
    </div>
  )
}

const Files = (props) => {
  const [selectedFile] = useState({})
  const [textFilter, setTextFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [files, setFiles] = useFiles()
  const [DropZone, SetDropZone] = useState(true)

  let toggleAddFile = () => {
    // let isAdding = !addingSecret
    // setAddingSecret(!addingSecret)
    // setEditingSecret(isAdding ? addSecret : null)
    // setSelectedSecret(isAdding ? addSecret : {})
    // //removing any non-submitted secrets.
    // setSecrets(_secrets.filter(s => s.id !== -1))
  }

  // if (addingSecret) _secrets.push(addSecret)
  var i = 0
  let _files = files
    .filter(f => {
      if (textFilter === '') return true
      if (f.fullname.toLowerCase().indexOf(textFilter.toLowerCase()) >= 0) return true
      return false
    })
    .map(f => {
      i++
      let selected = selectedFile === f
      return <FileListItem
        key={i}
        file={f}
        selected={selected}
        onDelete={() => {
          api.deleteFile(f.name)
          setFiles(files.filter(e => e !== f))  
        }
      }
      />
  })
  //let _secrets = [].concat(_secret())
  //if (addingSecret) _secrets.push(addSecret)

  return (
    <Filewrapper 
      textFilter={textFilter}
      setTextFilter={setTextFilter}
      statusFilter={statusFilter}
      setStatusFilter={(status) => {
        let _status = status === statusFilter ? '' : status
        setStatusFilter(_status)
        }}
      toggleAddFile={toggleAddFile}
    >
      <TopBar
          faIcon = {faFileCode}
          title = { "Files" }
        > 
      </TopBar>
      <div className="FileBody">
        <div className="FileInfoWrapper">
          <div className="FileList">
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 400}} aria-label="a dense table">
                <TableHead>
                </TableHead>
                <TableBody>
                  {_files}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className='FileEdit'>
            <FileForm
            onSubmit={async (e) => {
              SetDropZone(false)
              let newfile = await api.uploadFile(e)
              if (typeof newfile !== 'undefined') {
                setFiles(newfile.concat(files))
              }
              SetDropZone(true)
            }}
            showDropZone={DropZone}
            />
          </div>
        </div>
      </div>
    </Filewrapper>
  )
}

export default Files