import fixture from '../api/fixtures'

export function getData() {
  return new Promise(resolve => {
    let jsonData = JSON.stringify(fixture)
    const dict = [
      { '[()]': '' },
      { 'Meta Data': 'metaData' },
      { '1. Information': 'info' },
      { '2. Symbol': 'symbol' },
      { '3. Last Refreshed': 'lastRefreshed' },
      { '4. Interval': 'interval' },
      { '5. Output Size': 'outputSize' },
      { '6. Time Zone': 'timeZone' },
      { 'Time Series (1min)': 'tsM1' },
      { '1. open': 'open' },
      { '2. high': 'high' },
      { '3. low': 'low' },
      { '4. close': 'close' },
      { '5. volume': 'volume' }
    ]

    dict.forEach(item => {
      jsonData = jsonData.replace(
        new RegExp(Object.keys(item)[0], 'g'),
        item[Object.keys(item)[0]]
      )
    })

    const parsedData = JSON.parse(jsonData)
    const source = parsedData.tsM1

    const candles = Object.keys(source)
      .map(key => {
        return {
          date: new Date(key),
          open: +source[key].open,
          high: +source[key].high,
          low: +source[key].low,
          close: +source[key].close,
          volume: +source[key].volume
        }
      })
      .reverse()

    resolve(candles)
  })
}
