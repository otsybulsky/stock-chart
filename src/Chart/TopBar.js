import React from 'react'
import classNames from 'classnames/bind'
import s from './Chart.m.scss'

const cx = classNames.bind(s)

const TopBar = ({ symbol, loading }) => {
  return (
    <div className={cx('top-bar')}>
      <span>
        Ticker: {symbol} {loading && ' loading ...'}
      </span>
    </div>
  )
}

export default TopBar
