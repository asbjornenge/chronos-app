import React from 'react'
import ReactDOM from 'react-dom';
import Router from 'tiny-react-router'
import Header from './shared/components/Header'
import Dashboard from './screens/Dashboard'
import Task from './screens/Task'
import Secret from './screens/Secret'
import Files from './screens/Files'
import Failed from './screens/Failed'
import './shared/state'
import './index.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { nav } from './shared/utils';

let routes = {
  '/'         : Dashboard,
  '/task/:id' : Task,
  '/secrets'  : Secret,
  '/files'    : Files,
  '/failed'   : Failed,
  '/task/:id/step/:stepid': Task
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
