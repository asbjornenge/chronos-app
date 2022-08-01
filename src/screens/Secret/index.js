import React, { useState } from 'react'
import { useSecrets } from '../../shared/hooks'
import FilterBar from '../../shared/components/FilterBar'
import SecretListItem from './components/SecretListItem'
import SecretForm from './components/SecretForm'
import './index.css'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import * as api from '../../shared/api'
import TopBar from '../../shared/components/TopBar'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';

const addSecret = {
  id: -1,
}

const SecretWrapper = (props) => {
  return (
    <div className="Secret">
      <FilterBar 
        placeholder="Secret name" 
        type="secret"
        textFilter={props.textFilter}
        setTextFilter={props.setTextFilter}
        statusFilter={props.statusFilter}
        setStatusFilter={props.setStatusFilter}
        onAddClick={props.toggleAddSecret}
        disabledStatus={['paused', 'passing', 'failing', 'run']}
       />
      {props.children}
    </div>
  )
}

const Secret = (props) => {
  const [selectedSecret, setSelectedSecret] = useState({})
  const [editingSecret, setEditingSecret] = useState(null)
  const [addingSecret, setAddingSecret] = useState(false)
  const [textFilter, setTextFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [_secrets, setSecrets] = useSecrets()

  let toggleAddSecret = () => {
    let isAdding = !addingSecret
    setAddingSecret(!addingSecret)
    setEditingSecret(isAdding ? addSecret : null)
    setSelectedSecret(isAdding ? addSecret : {})
    //removing any non-submitted secrets.
    setSecrets(_secrets.filter(s => s.id !== -1))
  }

  if (addingSecret) _secrets.push(addSecret)
  let secrets = _secrets
    .filter(s => {
      if (textFilter === '') return true
      if (s.name.toLowerCase().indexOf(textFilter.toLowerCase()) >= 0) return true
      return false
    })
    .map(s => {
    let selected = selectedSecret.id === s.id
    return <SecretListItem
      key={s.id}
      secret={s}
      selected={selected}
      editSecret={() => {setEditingSecret(s)}}
      onClick={() => {
        setSelectedSecret(s)
        setEditingSecret(s)
        setAddingSecret(false)
      }}
      />
  })

  return (
    <SecretWrapper 
      textFilter={textFilter}
      setTextFilter={setTextFilter}
      statusFilter={statusFilter}
      setStatusFilter={(status) => {
        let _status = status === statusFilter ? '' : status
        setStatusFilter(_status)
        }}
      toggleAddSecret={toggleAddSecret}
    >
      <TopBar
          faIcon = {faLock}
          title = { "Secrets" }
        > 
      </TopBar>
      <div className="SecretBody">
        <div className="SecretInfoWrapper">
          <div className="SecretList">
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 400}} aria-label="a dense table">
                <TableHead>
                </TableHead>
                <TableBody>
                  {secrets}
                </TableBody>
              </Table>
            </TableContainer> 
          </div>
          <div className='SecretEdit'>
          { editingSecret && 
            <SecretForm
              numSecrets={_secrets.length}
              secret={editingSecret}
              onCancel={(secret) => {
                setEditingSecret(null)
                setAddingSecret(false)

                if (secret.id === -1) {
                  setSecrets(_secrets.filter(s => s.id !== secret.id ))
                }
              }}
              onDelete={async (secret) => {
                await api.removeSecret(secret)
                
                setSecrets(_secrets.filter(s => s.id !== secret.id))
                //todo actually delete the secret
                setEditingSecret(null)
                setSelectedSecret({})
                setAddingSecret(false)
              }}
              onSubmit={async (values) => {
                let adding = values.id === -1
                let _secret = await api.saveSecret(values)
                if (adding) {
                  setAddingSecret(false)
                  setSecrets([_secret].concat(_secrets.filter(s => s.id > 0)))
                }
                else {
                  setSecrets(_secrets.map(s => s.id === _secret.id ? _secret : s))
                }
                setEditingSecret(_secret)
                setSelectedSecret(_secret)
                setAddingSecret(false)
              }}
            />
          }
          </div>
        </div>
      </div>
    </SecretWrapper>
  )
}

export default Secret