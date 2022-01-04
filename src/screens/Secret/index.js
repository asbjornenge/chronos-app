import React, { useState } from 'react'
import { useSecrets } from '../../shared/hooks'
import FilterBar from '../../shared/components/FilterBar'
import Loading from '../../shared/components/Loading'
import Error from '../../shared/components/Error'
import SecretListItem from './components/SecretListItem'
import SecretForm from './components/SecretForm'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faCogs, faCog } from '@fortawesome/free-solid-svg-icons'
import * as api from '../../shared/api'

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
       />
      {props.children}
    </div>
  )
}

export default (props) => {
  const [selectedSecret, setSelectedSecret] = useState({})
  const [editingSecret, setEditingSecret] = useState(null)
  const [addingSecret, setAddingSecret] = useState(false)
  const [textFilter, setTextFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [_secrets, setSecrets] = useSecrets()
  //const _secret = () => api.getSecret()

  let toggleAddSecret = () => {
    let isAdding = !addingSecret
    setAddingSecret(!addingSecret)
    setEditingSecret(isAdding ? addSecret : null)
    setSelectedSecret(isAdding ? addSecret : {})
    //removing any non-submitted secrets.
    setSecrets(_secrets.filter(s => s.id !== -1))
  }

  if (addingSecret) _secrets.push(addSecret)
  let secrets = _secrets.map(s => {
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
  //let _secrets = [].concat(_secret())
  //if (addingSecret) _secrets.push(addSecret)

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
      <div className="SecretBody">
        <div className="top">
          <FontAwesomeIcon icon={faLock}/>
          <h1>SECRETS</h1>
          <div className="spacer"></div>
        </div>
        <div className="SecretInfoWrapper">
          <div className="SecretList">
            {secrets}  
          </div>
          <div className='SecretEdit'>
          { editingSecret && 
            <SecretForm
              numSecrets={_secrets.length}
              secret={editingSecret}
              onCancel={(secret) => {
                setEditingSecret(null)
                setAddingSecret(false)
                console.log(secret)

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
//  async togglePause() {
//    let res = await fetch(`${window.apihost}/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify({ paused: !task.paused}) })
//    if (!res.ok) return
//    props.dispatch(rest.actions.task.reset())
//    props.dispatch(rest.actions.task.sync({id:task.id, steps:true, execs:10}))
//  }
//}