import React from 'react'
import ReactDOM from 'react-dom';
import Router from 'tiny-react-router'
import Header from './shared/components/Header'
import Dashboard from './screens/Dashboard'
//import Task from './screens/Task'
import './shared/state'
import './index.css';

window.apihost = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:3001` : './api'

let routes = {
  '/'         : Dashboard,
//  '/task/:id' : Task
}


const App = () => {
  return (
    <div className="App">
      <Header />
      <Router routes={routes} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
