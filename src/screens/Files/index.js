import React, { useState, useEffect } from 'react'
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
import { DropzoneArea } from 'react-mui-dropzone'
import { Button, FormControl, FormLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material'

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
  const [addedFiles, setAddedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('root')
  const [avaliableFolders, setAvailableFolders] = useState([])
  const [addingDir, setAddingDir] = useState(false)
  const [newDirName, setNewDirName] = useState("")
  useEffect(() => {
    (async () => {
      let r = (await api.getFolders()).filter(f => !!f.folderName).map(f => f.folderName)
      setAvailableFolders(r)
    })()
    
  }, [])

  let toggleAddFile = () => {
    // let isAdding = !addingSecret
    // setAddingSecret(!addingSecret)
    // setEditingSecret(isAdding ? addSecret : null)
    // setSelectedSecret(isAdding ? addSecret : {})
    // //removing any non-submitted secrets.
    // setSecrets(_secrets.filter(s => s.id !== -1))
  }

  const submitHandler = async () => {
    //SetDropZone(false)
    setUploading(true)
    let newfile = await api.uploadFile(addedFiles, selectedFolder)
    if (typeof newfile !== 'undefined') {
      setFiles(newfile.concat(files))
    }

    setUploading(false)
  
    //SetDropZone(true)
  }

  const onFolderChange = async (c) => {
    setSelectedFolder(c.target.value)
  }

  const handleChange = (c) => {
    setAddedFiles([...c])
  }

  const onAddDirClick = async (c) => {
    setAddingDir(!addingDir)
  }
  
  const onDirectorySubmit = async (c) => {
    try {
      await api.mkdir(newDirName)
      setNewDirName("")
      setAddingDir(false)
      let d = [...avaliableFolders]
      d.push(newDirName)
      setAvailableFolders(d)
      setSelectedFolder(newDirName)
    }
    catch (err) {
      console.error(err)
    }

    
  }
  // if (addingSecret) _secrets.push(addSecret)
  var i = 0
  let _files = [...files]
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
          //let fileName = typeof f.subfolder != 'undefined' && f.subfolder !== null ? `${f.subfolder}/${f.name}`: f.name
          api.deleteFile(f.subfolder ? f.subfolder + '/' + f.name: f.name)
          setFiles(files.filter(e => e !== f))  
        }
      }
      />
  })
  //let _secrets = [].concat(_secret())
  //if (addingSecret) _secrets.push(addSecret)

  let folders = avaliableFolders.map(a => {
    return <MenuItem value={a}>{a}</MenuItem>
  })

  folders.unshift(<MenuItem value="root">root</MenuItem>)

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
            {
              !uploading && 
              <DropzoneArea
              onChange={handleChange.bind(this)}
              clearOnUnmount={true}
              showAlerts={false}
            >
            </DropzoneArea>
            }
            {
              
            }
            {
              !uploading && 
              <FormControl fullWidth>
                <InputLabel
                  id="folderSelectLabel"
                  className="FileFormChild"
                >
                  Folder
                </InputLabel>
                <Select 
                  labelId="folderSelectLabel"
                  id="selectedFolder"
                  value={selectedFolder}
                  label="Folder"
                  onChange={onFolderChange}
                  className="FileFormChild"
                >
                  {folders}
                </Select>
                {
                  addedFiles.length !== 0 && !uploading && 
                  <Button variant='outlined' onClick={submitHandler} className="FileFormChild">
                    Submit
                  </Button>
                }
              </FormControl>
              
            }

            {
              <Button
                onClick={onAddDirClick}
                style={{marginTop: "20px"}}
              >
                Add directory
              </Button>
            }
            {
              addingDir &&
              <FormControl fullWidth>
                <FormLabel style={{"marginTop": "20px"}}>Add new directory</FormLabel>
                <TextField label="Directory Name" value={newDirName} onChange={(c) => setNewDirName(c.target.value)}>
                  
                </TextField>
                <Button onClick={onDirectorySubmit}>
                  Submit
                </Button>
              </FormControl>
            }
            
            {/* <FileForm
            onSubmit={async (e) => {
              SetDropZone(false)
              let newfile = await api.uploadFile(e)
              if (typeof newfile !== 'undefined') {
                setFiles(newfile.concat(files))
              }
              SetDropZone(true)
            }}
            showDropZone={DropZone}
            /> */}
          </div>
        </div>
      </div>
    </Filewrapper>
  )
}

export default Files