export const fetchData = symbol => {
  // const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=6W3YXEXFI6PVG7NR`

  const apiUrl = `http://localhost:4000/api/data-m1?sym=${symbol}`

  return fetch(apiUrl).then(apiData => apiData.json())
}
