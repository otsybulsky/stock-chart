export const fetchData = symbol => {
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=6W3YXEXFI6PVG7NR`

  return fetch(apiUrl)
    .then(response => response.json())
    .then(apiData => {
      return apiData
    })
}
