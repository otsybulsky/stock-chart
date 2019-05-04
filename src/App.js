import React, { Component } from 'react'
import './App.css'
import DataProvider from './DataProvider'
import Chart from './Chart'

const Test = props => {
  const { getSymbol } = props
  console.log(props, getSymbol('ABC'))
  return null
}

class App extends Component {
  render() {
    return (
      <DataProvider>
        <Test />
      </DataProvider>
    )
  }
}

export default App
