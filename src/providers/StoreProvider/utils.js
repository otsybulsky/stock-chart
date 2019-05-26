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
