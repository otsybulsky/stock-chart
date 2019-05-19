import React, { useState, useEffect } from 'react'
import { fetchData } from '../api'
import { getStateFromStorage, saveStateToStorage } from './utils'
import { roundNumber } from 'shared/utils'

const normalizeDataAlphaVantage = data => {
  const source = data['Time Series (1min)']

  if (!source) {
    return null
  }

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

  const currentDateOffset = new Date().getTimezoneOffset() * 60 * 1000

  const getData = symbol => {
    if (data.currentDate) {
      return new Promise(resolve => {
        const cache = data.symbols[symbol]
        if (cache) {
          resolve(cache)
        } else {
          //fetch data from api
          fetchData(symbol).then(apiData => {
            const {
              chart: { result, error }
            } = apiData
            if (error) {
              resolve({ error: { message: 'API returns error', error } })
            } else {
              const data = result[0]
              if (!data['timestamp']) {
                resolve({ error: { message: 'Bad data', data } })
              } else {
                const quote = data.indicators.quote[0]
                const chart = data.timestamp
                  .map((item, i) => {
                    return {
                      date: new Date((item - 14400) * 1000 + currentDateOffset),
                      open: roundNumber(quote.open[i]),
                      high: roundNumber(quote.high[i]),
                      low: roundNumber(quote.low[i]),
                      close: roundNumber(quote.close[i]),
                      volume: roundNumber(quote.volume[i], 0)
                    }
                  })
                  .filter(
                    candle =>
                      candle.open &&
                      candle.high &&
                      candle.low &&
                      candle.close &&
                      candle.volume
                  )

                // setData({
                //   ...data,
                //   symbols: {
                //     ...data.symbols,
                //     [symbol]: apiData
                //   }
                // })

                resolve({ chart })
              }
            }
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
