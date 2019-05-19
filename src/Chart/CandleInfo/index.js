import React from 'react'

const CandleInfo = ({ candle }) => {
  if (!candle) {
    return null
  }
  return <div>{JSON.stringify(candle)}</div>
}

export default CandleInfo
