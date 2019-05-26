import React, { useState, useEffect } from 'react'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import './App.css'
import Layout from './Layout'

const App = () => {
  const [windowWidth, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    console.log(windowWidth)
  })

  return <span>Hello</span>
}

export default App
