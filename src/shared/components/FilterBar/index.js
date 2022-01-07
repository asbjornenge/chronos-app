import React from 'react'
import { nav } from '../../utils'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faHome, faFileCode, faUser } from '@fortawesome/free-solid-svg-icons'
import { useProfile } from '../../hooks.js'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default (props) => {
  const { profile } = useProfile()

  const doLogout = async() => {
    confirmAlert({
      title: 'Are you sure?',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => window.location = `${window.apihost}/logout`
        },
        {
          label: 'No',
        }
      ]
    });  
  }

  let authEnabled = () => {
    let returnvalue = typeof profile !== "undefined"
    console.log(returnvalue)
    return returnvalue
  }

  return (
    <div className="FilterBar">
      <input 
        type="search" 
        value={props.textFilter || ''}
        onChange={(e) => props.setTextFilter(e.target.value)}
        placeholder={props.placeholder || ''} />
      <div className="filterbuttons">
        <div 
          className={`filterbutton first ${props.statusFilter === 'failing' ? 'selected' : ''}${typeof props.disabledStatus !== 'undefined' && props.disabledStatus.find(d => d === 'failing') !== undefined ? 'disabled' : ""}`} 
          onClick={() => props.setStatusFilter('failing')}>
          <img src="graphics/failing.svg" alt="failing" />
          <span>FAILING</span>
        </div>
        <div 
          className={`filterbutton ${props.statusFilter === 'passing' ? 'selected' : ''}${typeof props.disabledStatus !== 'undefined' && props.disabledStatus.find(d => d === 'passing') !== undefined ? 'disabled' : ""}`} 
          onClick={() => props.setStatusFilter('passing')}>
          <img src="graphics/passing.svg" alt="passing" />
          <span>PASSING</span>
        </div>
        <div 
          className={`filterbutton ${props.statusFilter === 'paused' ? 'selected' : ''}${typeof props.disabledStatus !== 'undefined' && props.disabledStatus.find(d => d === 'paused') !== undefined ? 'disabled' : ""}`} 
          onClick={() => props.setStatusFilter('paused')}>
          <img src="graphics/paused.svg" alt="paused" />
          <span>PAUSED</span>
        </div>
        <div 
          onClick={props.onAddClick}
          className={`filterbutton last add ${props.type || ''}`}> 
          <img src="graphics/add-white.svg" alt="add" />
        </div>
      </div>

      <div className="filterbuttons"> 
      <div 
          className={`filterbutton first ${window.location.hash === "#/" || window.location.hash === "" ? 'selected': null}`} 
          onClick={() => nav('/')}>
          <FontAwesomeIcon icon={faHome}/>
          <span>HOME</span>
        </div>
        <div 
          className={`filterbutton ${window.location.hash === "#/secrets" ? 'selected': null}`} 
          onClick={() => nav('/secrets')}>
          <FontAwesomeIcon icon={faLock}/>
          <span>SECRETS</span>
        </div>
        <div 
          className={`filterbutton ${window.location.hash === "#/files" ? 'selected': null} ${authEnabled? "": "last"}`} 
          onClick={() => nav('/files')}>
          <FontAwesomeIcon icon={faFileCode}/>
          <span>FILES</span>
        </div>
        {
          authEnabled? 
          <div 
          className={`filterbutton last ProfileButton`}
          onClick={doLogout.bind(this)}
          >
          <FontAwesomeIcon icon={faUser}/>
          <span>SIGN OUT</span>
        </div>: ""
        }
        
      </div>
    </div>
  )
}
