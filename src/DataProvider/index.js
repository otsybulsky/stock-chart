import React, { useState, useEffect } from 'react'
import { fetchData } from '../api'

const storageName = 'rechart-data-cache'

const getStateFromStorage = () => {
  const data = localStorage.getItem(storageName)
  if (data) {
    return JSON.parse(data)
  }
}

const saveStateToStorage = data => {
  localStorage.setItem(storageName, JSON.stringify(data))
}

//-----------------------------------------------------------
const DataProvider = props => {
  //state
  const [data, setData] = useState({
    currentDate: null,
    symbols: {}
  })

  const resetData = () => {
    setData({
      currentDate: new Date(Date.now()).toISOString(),
      symbols: {}
    })
  }

  const checkCurrentDate = data => {
    return (
      data.currentDate &&
      data.currentDate.split('T')[0] ===
        new Date(Date.now()).toISOString().split('T')[0]
    )
  }

  const getData = symbol => {
    if (data.currentDate) {
      return new Promise(resolve => {
        const cache = data.symbols[symbol]
        if (cache) {
          resolve(cache)
        } else {
          //fetch data from api
          fetchData(symbol).then(apiData => {
            setData({
              ...data,
              symbols: {
                ...data.symbols,
                [symbol]: apiData
              }
            })

            resolve(apiData)
          })
        }
      })
    }
  }

  //effects
  useEffect(() => {
    //componentDidMount
    const restoredData = getStateFromStorage()

    if (restoredData && checkCurrentDate(restoredData)) {
      setData(restoredData)
    } else {
      resetData()
    }
  }, [])

  useEffect(() => {
    if (data.currentDate) {
      saveStateToStorage(data)
    }
  }, [data])

  //render
  const children = React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      getData: getData
    })
  })

  return <>{children}</>
}

export default DataProvider
