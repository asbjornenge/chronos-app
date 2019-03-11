import React from 'react'
import './index.css'

export default (props) => {
  return (
    <div className="FilterBar">
      <input 
        type="search" 
        value={props.textFilter || ''}
        onChange={(e) => props.setTextFilter(e.target.value)}
        placeholder={props.placeholder || ''} />
      <div className="filterbuttons">
        <div 
          className={`filterbutton first ${props.statusFilter === 'failing' ? 'selected' : ''}`} 
          onClick={() => props.setStatusFilter('failing')}>
          <img src="graphics/failing.svg" alt="failing" />
          <span>FAILING</span>
        </div>
        <div 
          className={`filterbutton ${props.statusFilter === 'passing' ? 'selected' : ''}`} 
          onClick={() => props.setStatusFilter('passing')}>
          <img src="graphics/passing.svg" alt="passing" />
          <span>PASSING</span>
        </div>
        <div 
          className={`filterbutton ${props.statusFilter === 'paused' ? 'selected' : ''}`} 
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
    </div>
  )
}
