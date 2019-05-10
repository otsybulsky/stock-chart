import React, { useState, useEffect } from 'react'
import useDimensions from 'react-use-dimensions'
import classNames from 'classnames/bind'
import Chart from './Chart'
import s from './Chart.m.scss'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { last } from 'react-stockcharts/lib/utils'
import Modal from '../Modal'
import GetSymbol from './GetSymbol'
import TopBar from './TopBar'

const cx = classNames.bind(s)

const normalizeData = data => {
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

const ChartComponent = ({ getData }) => {
  const [symbolState, setSymbolState] = useState({
    modalState: false,
    symbol: ''
  })

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
    setConfig({
      chartActive: true,
      data,
      xScale,
      xAccessor,
      displayXAccessor,
      xExtents
    })
  }

  useEffect(() => {
    setSymbolState({
      ...symbolState,
      symbol: 'SPY'
    })
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
      <TopBar symbol={symbolState.symbol} />
      <Chart
        className={cx('chart')}
        config={config}
        updateConfig={updateConfig}
        height={height - 40}
        width={width}
      />
    </div>
  )
}

export default ChartComponent
