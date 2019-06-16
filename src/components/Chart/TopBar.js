import React from 'react'
import classNames from 'classnames/bind'
import s from './Chart.m.scss'
import CandleInfo from './CandleInfo'
import IntervalBar from './IntervalBar'

const cx = classNames.bind(s)

const TopBar = ({
  symbol,
  interval,
  loading,
  lastVisibleCandle,
  onTickerClick,
  onSetInterval
}) => {
  return (
    <div className={cx('top-bar')}>
      <div className={cx('leftPart')}>
        <div className={cx('ticker')} onClick={onTickerClick}>
          Ticker: {symbol} {loading && ' loading ...'}
        </div>
        {!loading && (
          <IntervalBar interval={interval} onSetInterval={onSetInterval} />
        )}
      </div>

      {/* {!loading && <CandleInfo candle={lastVisibleCandle} />} */}
    </div>
  )
}

export default TopBar
