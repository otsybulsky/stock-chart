export const normalizeData = data => {
  const source = data['Time Series (1min)']

  const candles = Object.keys(source)
    .map(key => {
      return {
        date: new Date(key),
        open: +source[key]['1. open'],
        high: +source[key]['2. high'],
        low: +source[key]['3. low'],
        close: +source[key]['4. close'],
        volume: +source[key]['5. volume']
      }
    })
    .reverse()

  return candles
}

export const getData = symbol => {
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=6W3YXEXFI6PVG7NR`

  return fetch(apiUrl)
    .then(response => response.json())
    .then(apiData => {
      const initialData = normalizeData(apiData)
      return initialData
    })
}
