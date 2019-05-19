import React from 'react'
import classNames from 'classnames/bind'
import s from './Chart.m.scss'
import CandleInfo from './CandleInfo'

const cx = classNames.bind(s)

const TopBar = ({ symbol, loading, lastVisibleCandle }) => {
  return (
    <div className={cx('top-bar')}>
      <span>
        Ticker: {symbol} {loading && ' loading ...'}
      </span>
      <CandleInfo candle={lastVisibleCandle} />
    </div>
  )
}

export default TopBar
