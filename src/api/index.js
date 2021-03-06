import { roundNumber } from 'shared/utils'

export const fetchData = ({ symbol, interval }) => {
  // console.log('-', symbol, interval)
  const apiUrl = `${
    process.env.REACT_APP_API_URL
  }/data?sym=${symbol}&interval=${interval}`

  return fetch(apiUrl).then(apiData => apiData.json())
}

const currentDateOffset = new Date().getTimezoneOffset() * 60 * 1000

export const getData = props =>
  new Promise(resolve => {
    fetchData(props).then(apiData => {
      const {
        chart: { result, error }
      } = apiData
      if (error) {
        resolve({ error: { message: 'API returns error', error } })
      } else {
        const data = result[0]
        if (!data['timestamp']) {
          resolve({ error: { message: 'Bad data', data } })
        } else {
          const quote = data.indicators.quote[0]
          const chart = data.timestamp
            .map((item, i) => {
              return {
                date: new Date((item - 14400) * 1000 + currentDateOffset),
                open: roundNumber(quote.open[i]),
                high: roundNumber(quote.high[i]),
                low: roundNumber(quote.low[i]),
                close: roundNumber(quote.close[i]),
                volume: roundNumber(quote.volume[i], 0)
              }
            })
            .filter(
              candle =>
                candle.open &&
                candle.high &&
                candle.low &&
                candle.close &&
                candle.volume
            )

          resolve({ chart })
        }
      }
    })
  })
