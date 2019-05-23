import React, { useState, useEffect, useRef } from 'react'
import useDimensions from 'react-use-dimensions'
import classNames from 'classnames/bind'
import Chart from './Chart'
import s from './Chart.m.scss'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { last } from 'react-stockcharts/lib/utils'
import Modal from '../Modal'
import GetSymbol from './GetSymbol'
import TopBar from './TopBar'
import { getData } from 'api'

const cx = classNames.bind(s)

const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const ChartComponent = props => {
  const [symbolState, setSymbolState] = useState({
    modalState: false,
    symbol: ''
  })
  const previousSymbol = usePrevious(symbolState.symbol)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({})
  const [lastVisibleCandle, setLastVisibleCandle] = useState(null)
  const [ref, { width, height }] = useDimensions()

  const updateChart = apiData => {
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    )
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      apiData
    )
    const xExtents = [
      xAccessor(last(data)),
      xAccessor(data[data.length - Math.min(data.length, 400)])
    ]
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
    if (config.xExtents && config.xExtents.length === 2) {
      const ind = ~~config.xExtents[1] //~~ двойное битовое НЕ, возвращает целую часть числа
      if (ind < config.data.length) {
        setLastVisibleCandle(config.data[ind])
      }
    }

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
      setLoading(true)
      getData(symbolState.symbol).then(({ error, chart }) => {
        if (!error) {
          updateChart(chart)
        } else {
          console.log('--', symbolState.symbol, error)
          setSymbolState({
            ...symbolState,
            symbol: previousSymbol
          })
        }
        setLoading(false)
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
      if (~~first - 1 >= -1) {
        updateConfig({ xExtents: [first - 1, last - 1] })
      }
    }
    if (e.key === 'ArrowRight') {
      //step right
      const [first, last] = config.xExtents
      if (~~last + 1 < config.data.length) {
        updateConfig({ xExtents: [first + 1, last + 1] })
      }
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

  const onTickerClick = () => {
    setSymbolState({
      ...symbolState,
      modalState: true
    })
  }

  console.log('--', width, height)

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
      <TopBar
        symbol={symbolState.symbol}
        loading={loading}
        lastVisibleCandle={lastVisibleCandle}
        onTickerClick={onTickerClick}
      />
      {!loading && config.data && height && (
        <Chart
          className={cx('chart')}
          config={config}
          updateConfig={updateConfig}
          height={height - 40}
          width={width}
        />
      )}
    </div>
  )
}

export default ChartComponent
