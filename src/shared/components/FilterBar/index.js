import React from 'react'
import { nav } from '../../utils'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faHome, faFileCode, faUser, faBug } from '@fortawesome/free-solid-svg-icons'
import { useProfile } from '../../hooks.js'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Input } from '@mui/material'
import Paper from '@mui/material/Paper'

const FilterBar = (props) => {
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
    return returnvalue
  }

  return (
    <div>
      <Paper elevation={1}>
        <div className='FilterBar'>
        <Input 
            type="search" 
            value={props.textFilter || ''}
            onChange={(e) => props.setTextFilter(e.target.value)}
            placeholder={props.placeholder || ''} />
        <ButtonGroup variant="outlined" aria-label="outlined primary button group" className='filterbuttons'>
          <Button
            className={`filterbutton first ${props.statusFilter === 'failing' ? 'selected' : ''}${typeof props.disabledStatus !== 'undefined' && props.disabledStatus.find(d => d === 'failing') !== undefined ? 'disabled' : ""}`} 
            onClick={() => props.setStatusFilter('failing')}>
            <img src="graphics/failing.svg" alt="failing" />
            
          </Button>
          <Button
            className={`filterbutton ${props.statusFilter === 'passing' ? 'selected' : ''}${typeof props.disabledStatus !== 'undefined' && props.disabledStatus.find(d => d === 'passing') !== undefined ? 'disabled' : ""}`} 
            onClick={() => props.setStatusFilter('passing')}>
            <img src="graphics/passing.svg" alt="passing" />
            
          </Button>
          <Button
            className={`filterbutton ${props.statusFilter === 'paused' ? 'selected' : ''}${typeof props.disabledStatus !== 'undefined' && props.disabledStatus.find(d => d === 'paused') !== undefined ? 'disabled' : ""}`} 
            onClick={() => props.setStatusFilter('paused')}>
            <img src="graphics/paused.svg" alt="paused" />
            
          </Button>
          <Button
            className={`filterbutton ${props.statusFilter === 'run' ? 'selected' : ''}${typeof props.disabledStatus !== 'undefined' && props.disabledStatus.find(d => d === 'run') !== undefined ? 'disabled' : ""}`} 
            onClick={() => props.setStatusFilter('run')}>
            <img src="graphics/run.svg" alt="running" />
            
          </Button>
          <Button
            onClick={props.onAddClick}
            className={`filterbutton last add ${props.type || ''} ${props.noAdd ? "disabled": ""}`}> 
            <img src="graphics/add-white.svg" alt="add" />  
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="outlined" aria-label="outlined primary button group" className='filterbuttons NavButtons'>
            <Button
              className={`NavButton first ${window.location.hash === "#/" || window.location.hash === "" ? 'selected': null}`} 
              onClick={() => nav('/')}>
              <FontAwesomeIcon icon={faHome}/>
              <span>HOME</span>
            </Button>
            <Button 
              className={`NavButton ${window.location.hash === "#/secrets" ? 'selected': null}`} 
              onClick={() => nav('/secrets')}>
              <FontAwesomeIcon icon={faLock}/>
              <span>SECRETS</span>
            </Button>
            <Button
              className={`NavButton ${window.location.hash === "#/files" ? 'selected': null}`} 
              onClick={() => nav('/files')}>
              <FontAwesomeIcon icon={faFileCode}/>
              <span>FILES</span>
            </Button>
            <Button
              className={`NavButton ${window.location.hash === "#/failed" ? 'selected': null} ${authEnabled? "": "last"}`} 
              onClick={() => nav('/failed')}>
              <FontAwesomeIcon icon={faBug}/>
              <span>FAILED</span>
            </Button>
            {
              authEnabled? 
              <Button
                className={`NavButton last ProfileButton`}
                onClick={doLogout.bind(this)}
                >
                <FontAwesomeIcon icon={faUser}/>
                <span>LOGOUT</span>
              </Button>: ""
            }
          </ButtonGroup>
        </div>
      </Paper>
    </div>
  )
}

export default FilterBar