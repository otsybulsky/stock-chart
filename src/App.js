import React, { Component } from 'react'
import './App.css'
import DataProvider from './DataProvider'
import Chart from './Chart'

const Test = props => {
  props.getData('SPY')
  return null
}

class App extends Component {
  render() {
    return (
      <DataProvider>
        {/* <Test /> */}
        <Chart />
      </DataProvider>
    )
  }
}

export default App
