import React, { useState, useEffect } from 'react'
import { StoreContext } from 'shared/context'
import { saveStateToStorage, loadStateFromStorage } from './utils'
import uuid from 'uuid/v4'
import { containerType } from 'shared/types'

const defaultLayout = [
  { i: uuid(), x: 0, y: 0, w: 4, h: 4, moved: false, static: false },
  { i: uuid(), x: 0, y: 4, w: 4, h: 4, moved: false, static: false }
]

const StoreProvider = ({ windowSize, children }) => {
  const [state, setState] = useState({
    fullscreen: false,
    containerId: null,
    layout: [],
    backupLayout: [],
    containerStore: {}
  })

  const [isStart, setIsStart] = useState(true)
  const cols = 12

  const onFullscreenContainer = containerId => {
    setState(state => ({
      ...state,
      containerId,
      fullscreen: true,
      backupLayout: state.layout,
      layout: [] //clear layout and useEffect state.fulscreen
    }))
  }

  const onRestoreLayout = () => {
    setState(state => ({
      ...state,
      fullscreen: false,
      containerId: null,
      layout: [] //clear layout and useEffect state.fulscreen
    }))
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

      setState(state => ({
        ...state,
        layout: [container]
      }))
    }

    if (!state.fullscreen && !state.containerId) {
      setState(state => ({
        ...state,
        layout: state.backupLayout
      }))
    }
  }, [state.fullscreen])

  const onLayoutChange = newLayout => {
    setState(state => ({
      ...state,
      layout: newLayout
    }))
  }

  const removeItemFromLayout = id => {
    setState(state => {
      const containerStore = { ...state.containerStore }
      delete containerStore[id]

      return {
        ...state,
        containerStore,
        layout: state.layout.filter(item => item.i !== id)
      }
    })
  }

  const initContainerStore = containerId => {
    return {
      containerId,
      type: containerType.Chart,
      symbol: 'SPY'
    }
  }

  const addItemToLayout = () => {
    const id = uuid()
    setState(state => ({
      ...state,
      containerStore: {
        ...state.containerStore,
        [id]: initContainerStore(id)
      },
      layout: [
        ...state.layout,
        {
          i: id,
          x: 0,
          y: Infinity, // puts it at the bottom
          w: 4,
          h: 4
        }
      ]
    }))
  }

  useEffect(() => {
    const restored = loadStateFromStorage()
    if (restored && restored.config) {
      setState(state => ({ ...state, ...restored.config.state }))
    } else {
      let containerStore = {}
      defaultLayout.forEach(item => {
        containerStore = {
          ...containerStore,
          [item.i]: initContainerStore(item.i)
        }
      })

      setState(state => ({ ...state, containerStore, layout: defaultLayout }))
    }
    setIsStart(false)
  }, []) //componentDidMount

  useEffect(() => {
    if (!isStart) {
      saveStateToStorage({ config: { state } })
    }
  }, [state])

  const getContainerConfig = containerId => state.containerStore[containerId]

  return (
    <StoreContext.Provider
      value={{
        layout: [...state.layout],
        onLayoutChange,
        addItemToLayout,
        removeItemFromLayout,
        cols,
        fullscreen: state.fullscreen,
        onFullscreenContainer,
        onRestoreLayout,
        getContainerConfig
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
