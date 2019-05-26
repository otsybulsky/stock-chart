import React from 'react'
import classNames from 'classnames/bind'
import s from './Chart.m.scss'
import CandleInfo from './CandleInfo'

const cx = classNames.bind(s)

const TopBar = ({ symbol, loading, lastVisibleCandle, onTickerClick }) => {
  return (
    <div className={cx('top-bar')}>
      <div onClick={onTickerClick}>
        Ticker: {symbol} {loading && ' loading ...'}
      </div>
      <CandleInfo candle={lastVisibleCandle} />
    </div>
  )
}

export default TopBar
