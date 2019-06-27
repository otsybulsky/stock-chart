import React, { useState, useEffect } from 'react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'react-table/react-table.css'
import './App.css'
import Layout from './components/Layout'
import StoreProvider from './providers/StoreProvider'

const App = ({ size }) => {
  const [windowSize, setSize] = useState(null)

  useEffect(() => {
    setSize({ width: window.innerWidth - 16, height: window.innerHeight })
  }, [])

  return (
    <StoreProvider windowSize={windowSize}>
      {windowSize && <Layout size={windowSize} />}
    </StoreProvider>
  )
}

export default App
