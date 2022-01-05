import React, { Component } from 'react'
import './index.css'
import {useDropzone} from 'react-dropzone'

function DropZone(props, state) {
  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({})

  const fileHTML = acceptedFiles.map(file => 
    <p key={file.path}>{file.path}</p>
  )
  const submit = async () => {
    await props.onSubmit(acceptedFiles)
  }
  if (!props.showDropZone) {
    return (<div className='container'>
      <p>Upload in progress...</p>
    </div>)
  }

  return (
    <div className='container'>
      <div {...getRootProps()} className='TheDropZone'>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <aside>
        <h4>Files</h4>
        {fileHTML}
      </aside>
      {acceptedFiles.length !== 0 && 
      <button className='submitbtn' onClick={submit.bind()}>Submit</button>}
    </div>
  )
}

export default class FileForm extends Component {
  state = {
    files : []
  }
  render() {
    return (
      <div className="FileForm">
        <h2>Add File</h2>
          <DropZone {...this.props} {...this.state}/>
      </div>
    )
  }
  

  componentDidMount() {
    
  } 
}
