import React, { Component } from 'react'
import './App.css'
import DataProvider from './DataProvider'
import Chart from './Chart'

class App extends Component {
  render() {
    return (
      <DataProvider>
        <Chart />
      </DataProvider>
    )
  }
}

export default App
