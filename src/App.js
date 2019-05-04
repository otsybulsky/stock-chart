import React, { Component } from 'react'
import './App.css'
import DataProvider from './DataProvider'
import Chart from './Chart'

const Test = props => {
  const { getData } = props
  console.log(props, getData('ZYNE'))
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
