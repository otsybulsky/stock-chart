import React, { useState, useEffect } from 'react'
import { StoreContext } from 'shared/context'
import { saveStateToStorage, loadStateFromStorage } from './utils'
import uuid from 'uuid/v4'

const defaultLayout = [
  { i: uuid(), x: 0, y: 0, w: 4, h: 4, moved: false, static: false },
  { i: uuid(), x: 0, y: 4, w: 4, h: 4, moved: false, static: false }
]

const StoreProvider = ({ windowSize, children }) => {
  const [state, setState] = useState({
    fullscreen: false,
    containerId: null,
    layout: [],
    backupLayout: []
  })

  const [isStart, setIsStart] = useState(true)
  const cols = 12

  const onFullscreenContainer = containerId => {
    setState({
      ...state,
      containerId,
      fullscreen: true,
      backupLayout: state.layout.map(item => ({ i: item.i, ...item })),
      layout: [] //clear layout and useEffect state.fulscreen
    })
  }

  const onRestoreLayout = () => {
    setState({
      ...state,
      fullscreen: false,
      containerId: null,
      layout: [] //clear layout and useEffect state.fulscreen
    })
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

      setState({
        ...state,
        layout: [container]
      })
    }

    if (!state.fullscreen && !state.containerId) {
      setState({
        ...state,
        layout: state.backupLayout
      })
    }
  }, [state.fullscreen])

  const onLayoutChange = newLayout => {
    setState({
      ...state,
      layout: newLayout
    })
  }

  const removeItemFromLayout = id => {
    setState({
      ...state,
      layout: state.layout.filter(item => item.i !== id)
    })
  }

  const addItemToLayout = () => {
    setState({
      ...state,
      layout: [
        ...state.layout,
        {
          i: uuid(),
          x: 0,
          y: Infinity, // puts it at the bottom
          w: 4,
          h: 4
        }
      ]
    })
  }

  useEffect(() => {
    const restored = loadStateFromStorage()
    if (restored && restored.config) {
      setState({ ...state, ...restored.config.state })
    } else {
      setState({ ...state, layout: defaultLayout })
    }
    setIsStart(false)
  }, []) //componentDidMount

  useEffect(() => {
    if (!isStart) {
      //reconfigure for autoupdate after restore
      const _lay = state.layout.map(item => ({ i: item.i, ...item }))

      saveStateToStorage({ config: { state: { ...state, layout: _lay } } })
    }
  }, [state])

  return (
    <StoreContext.Provider
      value={{
        layout: state.layout,
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
