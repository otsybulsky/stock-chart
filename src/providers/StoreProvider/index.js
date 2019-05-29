import React, { useState, useEffect } from 'react'
import { StoreContext } from 'shared/context'
import { saveStateToStorage, loadStateFromStorage } from './utils'
import uuid from 'uuid/v4'
import _ from 'lodash'

const defaultLayout = [
  { i: uuid(), x: 0, y: 0, w: 4, h: 4, moved: false, static: false },
  { i: uuid(), x: 0, y: 4, w: 4, h: 4, moved: false, static: false }
]

const StoreProvider = ({ windowSize, children }) => {
  const [layout, setLayout] = useState([])
  const [state, setState] = useState({
    fullscreen: false,
    containerId: null,
    backupLayout: []
  })
  const [isStart, setIsStart] = useState(true)
  const cols = 12

  const onFullscreenContainer = containerId => {
    setState({
      ...state,
      containerId,
      fullscreen: true,
      backupLayout: layout.map(item => ({ i: item.i, ...item }))
    })
    setLayout([])
  }

  const onRestoreLayout = () => {
    setState({
      ...state,
      fullscreen: false,
      containerId: null
    })
    setLayout([])
  }

  useEffect(() => {
    if (state.fullscreen && state.containerId) {
      const container = {
        i: state.containerId,
        x: 0,
        y: 0,
        w: cols,
        h: ~~windowSize.height / (~~windowSize.height / cols) - 1,
        static: true
      }

      setLayout([container])
    }

    if (!state.fullscreen && !state.containerId) {
      setLayout(state.backupLayout)
    }
  }, [state.fullscreen])

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
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 4,
        h: 4
      }
    ])
  }

  useEffect(() => {
    const restored = loadStateFromStorage()
    if (restored && restored.config) {
      setLayout(restored.config.layout)
      setState({ ...state, ...restored.config.state })
    } else {
      setLayout(defaultLayout)
    }
    setIsStart(false)
  }, [])

  useEffect(() => {
    if (!isStart) {
      //reconfigure for autoupdate after restore
      const lay = layout.map(item => ({ i: item.i, ...item }))

      saveStateToStorage({ config: { state, layout: lay } })
    }
  }, [state, layout])

  return (
    <StoreContext.Provider
      value={{
        layout,
        onLayoutChange,
        addItemToLayout,
        removeItemFromLayout,
        cols,
        fullscreen: state.fullscreen,
        onFullscreenContainer,
        onRestoreLayout
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
