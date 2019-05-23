export const fetchData = symbol => {
  const apiUrl = `http://localhost:4000/api/data-m1?sym=${symbol}`

  return fetch(apiUrl).then(apiData => apiData.json())
}
