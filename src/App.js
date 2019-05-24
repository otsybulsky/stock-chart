import React, { useState, Component, useEffect } from 'react'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import './App.css'
import DataProvider from './DataProvider'
import Chart from './Chart'
import GridLayout from 'react-grid-layout'
import GridCell from './GridCell'

class Wrapper extends Component {
  render() {
    var that = this
    var newChildren = React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, {
        width: that.props.style.width,
        height: that.props.style.height
      })
    })
    return <div {...this.props}>{newChildren}</div>
  }
}

const App = () => {
  const [layoutState, changeLayout] = useState({
    '1': { x: 0, y: 0, w: 5, h: 5 },
    '2': { x: 0, y: 5, w: 5, h: 5 }
  })

  return (
    <DataProvider>
      <GridLayout
        className="layout"
        cols={12}
        rowHeight={50}
        width={1920}
        isResizable
        onResizeStop={(layout, oldItem, newItem, placeholder, e, element) => {
          const { i, x, y, w, h } = newItem
          changeLayout({
            ...layoutState,
            [i]: { x, y, w, h }
          })
        }}
      >
        {Object.keys(layoutState).map(key => {
          const cellConfig = layoutState[key]
          return (
            <Wrapper key={key} data-grid={cellConfig}>
              <Chart />
            </Wrapper>
          )
        })}
      </GridLayout>
    </DataProvider>
  )
}

export default App
