import React, { useState, useEffect } from 'react'
import { StoreContext } from 'shared/context'
import { saveStateToStorage, loadStateFromStorage } from './utils'
import uuid from 'uuid/v4'

const defaultLayout = [
  { i: uuid(), x: 0, y: 0, w: 4, h: 4 },
  { i: uuid(), x: 0, y: 4, w: 4, h: 4 }
]

const StoreProvider = ({ children }) => {
  const [layout, setLayout] = useState([])
  const [isStart, setIsStart] = useState(true)
  const cols = 12

  const onLayoutChange = newLayout => {
    setLayout(newLayout)
  }

  const removeItemFromLayout = id => {
    setLayout(layout.filter(item => item.i !== id))
  }

  const addItemToLayout = () => {
    setLayout([
      ...layout,
      {
        i: uuid(),
        x: (layout.length * 2) % cols,
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2
      }
    ])
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
      value={{
        layout,
        onLayoutChange,
        addItemToLayout,
        removeItemFromLayout,
        cols
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
