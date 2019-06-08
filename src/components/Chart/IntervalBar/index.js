import React from 'react'
import { intervalType } from 'shared/types'
import s from './IntervalBar.m.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(s)

const IntervalBar = ({ interval, onSetInterval }) => {
  return (
    <div className={s.container}>
      {Object.keys(intervalType).map(key => {
        const current = intervalType[key] === interval ? true : null
        return (
          <div
            className={cx('period', { current })}
            onClick={() => onSetInterval(intervalType[key])}
          >
            {key}
          </div>
        )
      })}
    </div>
  )
}

export default IntervalBar
