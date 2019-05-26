import React, { useState, useEffect } from 'react'
import { StoreContext } from 'shared/context'
import { saveStateToStorage, loadStateFromStorage } from './utils'
import uuid from 'uuid/v4'

const defaultLayout = [
  { i: uuid(), x: 0, y: 0, w: 5, h: 5 },
  { i: uuid(), x: 0, y: 5, w: 5, h: 5 }
]

const StoreProvider = ({ children }) => {
  const [layout, setLayout] = useState([])
  const [isStart, setIsStart] = useState(true)

  const onLayoutChange = newLayout => {
    setLayout(newLayout)
  }

  const removeItemFromLayout = id => {
    setLayout(layout.filter(item => item.i !== id))
  }

  useEffect(() => {
    const previousState = loadStateFromStorage()
    if (previousState && previousState.layout) {
      setLayout(previousState.layout)
    } else {
      setLayout(defaultLayout)
    }
    setIsStart(false)
  }, [])

  useEffect(() => {
    if (!isStart) {
      saveStateToStorage({ layout })
    }
  }, [layout])

  return (
    <StoreContext.Provider
      value={{ layout, onLayoutChange, removeItemFromLayout }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
