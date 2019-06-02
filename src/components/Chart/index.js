import React, { useState, useEffect, useRef, useContext } from 'react'
import classNames from 'classnames/bind'
import Chart from './Chart'
import s from './Chart.m.scss'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { last } from 'react-stockcharts/lib/utils'
import Modal from '../Modal'
import GetSymbol from './GetSymbol'
import TopBar from './TopBar'
import { getData } from 'api'
import { StoreContext } from 'shared/context'

const cx = classNames.bind(s)

const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const ChartComponent = ({ containerId, ...props }) => {
  const {
    containerStore,
    getContainerConfig,
    setContainerConfig,
    setGroupSymbol
  } = useContext(StoreContext)

  const [symbolState, setSymbolState] = useState({
    modalState: false,
    symbol: '',
    manualEdit: false
  })
  const previousSymbol = usePrevious(symbolState.symbol)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({})
  const [lastVisibleCandle, setLastVisibleCandle] = useState(null)

  const { groupId, symbol: containerSymbol } = getContainerConfig(containerId)

  if (
    groupId &&
    containerSymbol !== symbolState.symbol &&
    !symbolState.manualEdit
  ) {
    setSymbolState({
      ...symbolState,
      symbol: containerSymbol
    })
  }

  const updateChart = apiData => {
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    )
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      apiData
    )

    const { xVisibleCount } = getContainerConfig(containerId)

    const xExtents = [
      xAccessor(
        data[data.length - Math.min(data.length, xVisibleCount || 400)]
      ),
      xAccessor(last(data))
    ]

    setConfig(config => {
      let chartActive = false
      if (symbolState.manualEdit) {
        chartActive = true
        setSymbolState(state => {
          setGroupSymbol(containerId, state.symbol)
          return {
            ...state,
            manualEdit: false
          }
        })
      }
      const newConfig = {
        ...config,
        chartActive,
        data,
        xScale,
        xAccessor,
        displayXAccessor,
        xExtents
      }
      saveConfig(newConfig)

      return newConfig
    })
  }

  useEffect(() => {
    const { symbol } = getContainerConfig(containerId)
    setSymbolState({
      ...symbolState,
      symbol
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
            symbol: previousSymbol,
            manualEdit: false
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
        modalState: true,
        manualEdit: true
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
    setConfig(config => {
      const newConfig = { ...config, ...params }
      saveConfig(config)
      return newConfig
    })
  }

  const saveConfig = config => {
    const { symbol } = symbolState
    let currentConfig = {
      containerId,
      symbol: symbolState.symbol
    }

    if (config.xExtents && config.xExtents.length === 2) {
      currentConfig = {
        ...currentConfig,
        xVisibleCount: ~~config.xExtents[1] - ~~config.xExtents[0] + 1
      }
    }

    setContainerConfig(currentConfig)
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
      setSymbolState({ ...symbolState, modalState: false, manualEdit: false })
    }
  }

  const onTickerClick = () => {
    setSymbolState({
      ...symbolState,
      modalState: true
    })
  }

  const { width, height } = props

  if (!(width > 0 && height > 0)) {
    return null
  }

  return (
    <div
      onMouseEnter={changeScroll}
      onMouseLeave={changeScroll}
      className={cx('container')}
    >
      {!config.data ? (
        <>
          <div>Loading...</div>
          <span>{containerId}</span>
          <span>{symbolState.symbol}</span>
        </>
      ) : (
        <>
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
          {!loading && config.data && props.height && (
            <Chart
              className={cx('chart')}
              config={config}
              updateConfig={updateConfig}
              height={height - 40 - 10}
              width={width - 10}
            />
          )}
        </>
      )}
    </div>
  )
}

export default ChartComponent
