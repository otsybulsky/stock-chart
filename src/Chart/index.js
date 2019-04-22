import React, { useState, useEffect } from 'react'
import useDimensions from 'react-use-dimensions'
import classNames from 'classnames/bind'
import Chart from './Chart'
import { getData } from './utils'
import s from './Chart.m.scss'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { last } from 'react-stockcharts/lib/utils'

const cx = classNames.bind(s)

const ChartComponent = () => {
  const [config, setConfig] = useState(null)

  const [ref, { width, height }] = useDimensions()

  useEffect(() => {
    const fetchData = async () => {
      const initialData = await getData()
      console.log('=========fetching data')

      const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
        d => d.date
      )
      const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
        initialData
      )
      const xExtents = [
        xAccessor(last(data)),
        xAccessor(data[data.length - 200])
      ]
      setConfig({ data, xScale, xAccessor, displayXAccessor, xExtents })
    }
    fetchData()
  }, [])

  const updateConfig = params => setConfig({ ...config, ...params })

  if (!config) {
    return <div>Loading...</div>
  }

  function changeScroll() {
    let style = document.body.style.overflow
    document.body.style.overflow = style === 'hidden' ? 'auto' : 'hidden'
  }

  return (
    <div
      ref={ref}
      onMouseEnter={changeScroll}
      onMouseLeave={changeScroll}
      className={cx('container')}
    >
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
