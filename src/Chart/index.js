import React, { useState, useEffect } from 'react'
import useDimensions from 'react-use-dimensions'
import classNames from 'classnames/bind'
import Chart from './Chart'
import { getData, normalizeData } from './utils'
import s from './Chart.m.scss'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { last } from 'react-stockcharts/lib/utils'
import Modal from '../Modal'
import GetSymbol from './GetSymbol'

const cx = classNames.bind(s)

const ChartComponent = () => {
  const [symbolState, setSymbolState] = useState({
    modalState: false,
    symbol: ''
  })

  const [dataCache, setDataCache] = useState({ charts: {} })
  const [firstLoad, setFirstLoad] = useState(false)

  const [config, setConfig] = useState({})
  const [ref, { width, height }] = useDimensions()

  const updateChart = apiData => {
    const initialData = normalizeData(apiData)

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    )
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    )
    const xExtents = [xAccessor(last(data)), xAccessor(data[data.length - 300])]
    setConfig({ data, xScale, xAccessor, displayXAccessor, xExtents }) // тут відвалюється перехоплення клавіш
  }

  const resetDataCache = () => {
    const data = {
      cacheDate: new Date(Date.now()).toISOString(),
      charts: {}
    }
    console.log('--set state', data)
    setDataCache(data)
  }

  useEffect(() => {
    if (dataCache.cacheDate) {
      localStorage.setItem('rechart-data-cache', JSON.stringify(dataCache))
      console.log('--save', dataCache)
    }

    if (!firstLoad && dataCache.cacheDate) {
      const symbol = 'SPY'
      if (dataCache.charts[symbol]) {
        console.log('--get from cache')
        updateChart(dataCache.charts[symbol])
      } else {
        getData('SPY').then(apiData => {
          console.log('--set cache')

          const newData = {
            ...dataCache,
            charts: {
              ...dataCache.charts,
              [symbol]: apiData
            }
          }
          console.log(newData, dataCache)
          setDataCache(newData)
          updateChart(apiData)
        })
      }
      setFirstLoad(true)
    }
  }, [dataCache, firstLoad])

  useEffect(() => {
    const storedDataCache = localStorage.getItem('rechart-data-cache')

    if (!storedDataCache) {
      resetDataCache()
    } else {
      const data = JSON.parse(storedDataCache)
      if (
        !data.cacheDate ||
        data.cacheDate.split('T')[0] !==
          new Date(Date.now()).toISOString().split('T')[0]
      ) {
        resetDataCache()
      } else {
        setDataCache(data)
      }
    }
  }, [])

  useEffect(() => {
    if (config.chartActive) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [config])

  useEffect(() => {
    if (symbolState.symbol) {
      getData(symbolState.symbol).then(initialData => {
        updateChart(initialData)
      })
    }
  }, [symbolState.symbol])

  const handleKeyDown = e => {
    const letters = /Key[A-Za-z]/

    if (e.code.match(letters)) {
      setSymbolState({
        ...symbolState,
        modalState: true
      })
    }

    if (e.key === 'ArrowLeft') {
      //step left
      const [first, last] = config.xExtents
      updateConfig({ xExtents: [first - 1, last - 1] })
    }
    if (e.key === 'ArrowRight') {
      //step right
      const [first, last] = config.xExtents
      updateConfig({ xExtents: [first + 1, last + 1] })
    }
  }

  const updateConfig = params => {
    setConfig({ ...config, ...params })
  }

  if (!config.data) {
    return <div>Loading...</div>
  }

  function changeScroll() {
    let style = document.body.style.overflow
    document.body.style.overflow = style === 'hidden' ? 'auto' : 'hidden'
  }

  const closeModal = ({ symbol = '' }) => {
    const isUpdate = symbol && symbol !== symbolState.symbol

    if (isUpdate) {
      setSymbolState({
        ...symbolState,
        symbol,
        modalState: false
      })
    } else {
      setSymbolState({ ...symbolState, modalState: false })
    }
  }

  return (
    <div
      ref={ref}
      onMouseEnter={changeScroll}
      onMouseLeave={changeScroll}
      className={cx('container')}
    >
      <Modal
        noBackground
        modalState={symbolState.modalState}
        closeModal={closeModal}
      >
        <GetSymbol closeModal={closeModal} />
      </Modal>

      <Chart
        config={config}
        updateConfig={updateConfig}
        height={height}
        width={width}
      />
    </div>
  )
}

export default ChartComponent
