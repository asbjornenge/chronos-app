import React from 'react'
import ReactDOM from 'react-dom';
import Router from 'tiny-react-router'
import Header from './shared/components/Header'
import Dashboard from './screens/Dashboard'
import Task from './screens/Task'
import Secret from './screens/Secret'
import './shared/state'
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { nav } from './shared/utils';

let routes = {
  '/'         : Dashboard,
  '/task/:id' : Task,
  '/secrets'  : Secret
}

const App = () => {
  if(window.location.hash === "") nav("/")
  return (
    <div className="App">
      <Header />
      <Router routes={routes} />
      <ToastContainer position='bottom-right' />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
