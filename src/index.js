import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import Router from 'tiny-react-router'
import Header from './shared/components/Header'
import Dashboard from './screens/Dashboard'
import Task from './screens/Task'
import createStore from './store'
import './index.css';

let store = createStore()

let routes = {
  '/'         : Dashboard,
  '/task/:id' : Task
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Header />
          <Router routes={routes} />
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
