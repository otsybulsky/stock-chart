import React, { useState, useEffect } from 'react'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import '../node_modules/react-confirm-alert/src/react-confirm-alert.css'
import './App.css'
import Layout from './components/Layout'
import StoreProvider from './providers/StoreProvider'

const App = ({ size }) => {
  const [windowSize, setSize] = useState(null)

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  return (
    <StoreProvider windowSize={windowSize}>
      {windowSize && <Layout size={windowSize} />}
    </StoreProvider>
  )
}

export default App
