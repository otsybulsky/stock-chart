import React from 'react'
import s from './CandleInfo.m.scss'
import { roundNumber } from 'shared/utils'

const dateToString = date => {
  const arrDate = date.toISOString().split('T')
  return `${arrDate[0]} ${date.toTimeString().slice(0, 5)}`
}

const volumeToString = volume => {
  let result = volume
  if (volume >= 1000) {
    result = `${roundNumber(volume / 1000)}K`
  }
  if (volume >= 1000000) {
    result = `${roundNumber(volume / 1000000)}M`
  }
  return result
}

const CandleInfo = ({ candle }) => {
  if (!candle) {
    return null
  }

  return (
    <div className={s.container}>
      {dateToString(candle.date)}
      <div className={s.field}>O:{candle.open}</div>
      <div className={s.field}>H:{candle.high}</div>
      <div className={s.field}>L:{candle.low}</div>
      <div className={s.field}>C:{candle.close}</div>
      <div className={s.field}>{volumeToString(candle.volume)}</div>
    </div>
  )
}

export default CandleInfo
