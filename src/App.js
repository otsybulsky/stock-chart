import React from 'react'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import './App.css'
import DataProvider from './DataProvider'
import Chart from './Chart'
import GridLayout from 'react-grid-layout'
import GridCell from './GridCell'

const App = () => {
  return (
    <DataProvider>
      {/* <Chart /> */}
      <GridLayout
        className="layout"
        cols={12}
        rowHeight={50}
        width={1280}
        isResizable
      >
        <div key="1" data-grid={{ x: 0, y: 0, w: 5, h: 5, static: false }}>
          <Chart />
        </div>
        <div key="2" data-grid={{ x: 5, y: 0, w: 5, h: 5, static: false }}>
          <Chart />
        </div>
      </GridLayout>
    </DataProvider>
  )
}

export default App
