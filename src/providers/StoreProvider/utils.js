const storageName = 'rechart-store'

export const loadStateFromStorage = () => {
  const data = localStorage.getItem(storageName)
  if (data) {
    return JSON.parse(data)
  }
}

export const saveStateToStorage = data => {
  localStorage.setItem(storageName, JSON.stringify(data))
}

export const fixtureGenerator = (data, setData) => {
  const symbols = ['SPY', 'AAL', 'ALK', 'DAL', 'UAL', 'JBLU', 'SAVE']
  const intervals = [100, 500, 1500]

  setTimeout(function fixture() {
    const symbol = symbols[~~(symbols.length * Math.random())]
    const interval = intervals[~~(intervals.length * Math.random())]
    setData(data => [
      ...data,
      {
        symbol,
        time: new Date(Date.now()).toLocaleTimeString()
      }
    ])
    setTimeout(fixture, interval)
  }, 1000)
}
