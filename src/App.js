import React, { useState, useEffect } from 'react'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import './App.css'

import Layout from './Layout'

const App = ({ size }) => {
  const [windowSize, setSize] = useState(null)

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  return windowSize && <Layout size={windowSize} />
}

export default App
