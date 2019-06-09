import React, { useState, useEffect } from 'react'
import { StoreContext } from 'shared/context'
import { saveStateToStorage, loadStateFromStorage } from './utils'
import uuid from 'uuid/v4'
import { containerType } from 'shared/types'
import debounce from 'debounce'

const defaultLayout = [
  { i: uuid(), x: 0, y: 0, w: 8, h: 4 },
  { i: uuid(), x: 0, y: 4, w: 8, h: 4 }
]

const ungroupId = '0'

const groups = [
  { id: ungroupId, name: 'Ungroup' },
  { id: uuid(), name: 'Group 1' },
  { id: uuid(), name: 'Group 2' },
  { id: uuid(), name: 'Group 3' }
]

const StoreProvider = ({ windowSize, children }) => {
  const [state, setState] = useState({
    fullscreen: false,
    containerId: null,
    layout: [],
    backupLayout: [],
    containerStore: {},
    groups: [],
    groupStore: {}
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
      typeId: containerType.Chart.id,
      symbol: 'SPY',
      groupId: null
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

      setState(state => ({
        ...state,
        containerStore,
        layout: defaultLayout,
        groups
      }))
    }
    setIsStart(false)

    return () => {
      //clear debounced
      setContainerConfig.clear()
    }
  }, []) //componentDidMount, componentWillUnmount

  useEffect(() => {
    if (!isStart) {
      saveStateToStorage({ config: { state } })
    }
  }, [state])

  const getContainerConfig = containerId => state.containerStore[containerId]
  const setContainerConfig = debounce(
    ({ containerId, ...containerConfig }) =>
      setState(state => {
        const currentConfig = state.containerStore[containerId]
        const newConfig = {
          ...currentConfig,
          ...containerConfig
        }

        if (JSON.stringify(currentConfig) !== JSON.stringify(newConfig)) {
          return {
            ...state,
            containerStore: {
              ...state.containerStore,
              [containerId]: newConfig
            }
          }
        } else {
          return state
        }
      }),
    50
  )

  const getGroups = () => state.groups

  //убрать дублювання кода по установці група - контейнер і символ - група
  //можливо group store вже не потрібно ???????

  const setContainerGroup = (containerId, groupId) => {
    if (groupId === ungroupId) {
      groupId = null
    }
    setState(state => {
      let changes = {}

      let containerConfig = {
        ...state.containerStore[containerId],
        groupId
      }

      if (groupId) {
        const containerStore = { ...state.containerStore }

        let symbol = containerConfig.symbol

        const groupedContainers = Object.values(containerStore).filter(
          item =>
            item.typeId === containerType.Chart.id && item.groupId === groupId
        )

        if (groupedContainers.length) {
          symbol = groupedContainers[0].symbol
          containerConfig = {
            ...containerConfig,
            symbol
          }
        } else {
          const groupConfig = {
            ...state.groupStore[groupId],
            symbol
          }
          changes = {
            ...changes,
            groupStore: {
              ...state.groupStore,
              [groupId]: groupConfig
            }
          }
        }
      }

      changes = {
        ...changes,
        containerStore: {
          ...state.containerStore,
          [containerId]: containerConfig
        }
      }

      return {
        ...state,
        ...changes
      }
    })
  }

  const setGroupSymbol = (containerId, symbol) => {
    const { groupId } = state.containerStore[containerId]

    if (groupId) {
      setState(state => {
        const groupConfig = {
          ...state.groupStore[groupId],
          symbol
        }

        const containerStore = { ...state.containerStore }
        Object.keys(containerStore).forEach(cId => {
          const config = containerStore[cId]
          if (config.groupId === groupId) {
            if (
              config.typeId === containerType.Chart.id &&
              config.symbol !== symbol
            ) {
              config.symbol = symbol
            }
          }
        })

        return {
          ...state,
          groupStore: {
            ...state.groupStore,
            [groupId]: groupConfig
          },
          containerStore
        }
      })
    }
  }

  const setContainerType = (containerId, typeId) => {
    setState(state => {
      const containerConfig = {
        ...state.containerStore[containerId],
        typeId
      }

      return {
        ...state,
        containerStore: {
          ...state.containerStore,
          [containerId]: containerConfig
        }
      }
    })
  }

  return (
    <StoreContext.Provider
      value={{
        layout: state.layout,
        containerStore: state.containerStore,
        onLayoutChange,
        addItemToLayout,
        removeItemFromLayout,
        cols,
        fullscreen: state.fullscreen,
        onFullscreenContainer,
        onRestoreLayout,
        getContainerConfig,
        setContainerConfig,
        getGroups,
        setContainerGroup,
        setContainerType,
        setGroupSymbol
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
