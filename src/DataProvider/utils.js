const storageName = 'rechart-data-cache'

export const getStateFromStorage = () => {
  const data = localStorage.getItem(storageName)
  if (data) {
    return JSON.parse(data)
  }
}

export const saveStateToStorage = data => {
  localStorage.setItem(storageName, JSON.stringify(data))
}
