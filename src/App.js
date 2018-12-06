import React, { Component } from 'react'
import Router from 'tiny-react-router'
import Dashboard from './screens/Dashboard'
import './App.css'

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
        <Router routes={routes} />
      </div>
    );
  }
}

export default App;
