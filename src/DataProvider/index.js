import React, { useState, useEffect } from 'react'
import { fetchData } from '../api'

const storageName = 'test'

const getStateFromStorage = () => {
  const data = localStorage.getItem(storageName)
  if (data) {
    return JSON.parse(data)
  }
}

const saveStateToStorage = data => {
  localStorage.setItem(storageName, JSON.stringify(data))
}

export const normalizeData = data => {
  const source = data['Time Series (1min)']

  const candles = Object.keys(source)
    .map(key => {
      return {
        date: new Date(key),
        open: +source[key]['1. open'],
        high: +source[key]['2. high'],
        low: +source[key]['3. low'],
        close: +source[key]['4. close'],
        volume: +source[key]['5. volume']
      }
    })
    .reverse()

  return candles
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
      const cache = data.symbols[symbol]
      if (cache) {
        return normalizeData(cache)
      }
      //fetch data from api
      fetchData(symbol).then(apiData => {
        setData({
          ...data,
          symbols: {
            ...data.symbols,
            [symbol]: apiData
          }
        })

        return normalizeData(apiData)
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
