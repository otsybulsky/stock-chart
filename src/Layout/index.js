import React, { useState, Component, useEffect } from 'react'
import './Layout.css'
import Wrapper from './Wrapper'
import GridLayout from 'react-grid-layout'

const Layout = ({ width }) => {
  const [layoutState, changeLayout] = useState({
    '1': { x: 0, y: 0, w: 5, h: 5 },
    '2': { x: 0, y: 5, w: 5, h: 5 }
  })

  console.log('--', width)

  if (!width) {
    return null
  }

  return (
    <GridLayout
      className="layout"
      cols={12}
      rowHeight={50}
      width={width}
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
            <div>{key}</div>
          </Wrapper>
        )
      })}
    </GridLayout>
  )
}

export default Layout
