import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import Router from 'tiny-react-router'
import Dashboard from './screens/Dashboard'
import createStore from './store'
import './index.css';

let store = createStore()

let routes = {
  '/' : Dashboard
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img alt="logo" src="/graphics/logo.png" />
        </header>
        <Provider store={store}>
          <Router routes={routes} />
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
