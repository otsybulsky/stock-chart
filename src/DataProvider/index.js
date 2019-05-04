import React, { useState, useEffect } from 'react'

const storageName = 'test'

const getStateFromStorage = () => {
  const data = localStorage.getItem(storageName)
  if (data) {
    return JSON.parse(data)
  }
}

const saveStateToStorage = data => {
  localStorage.setItem(storageName, JSON.stringify(data))
}
//-----------------------------------------------------------
const DataProvider = props => {
  //state
  const [data, setData] = useState({
    currentDate: null,
    symbols: {}
  })

  const resetData = () => {
    setData({
      currentDate: new Date(Date.now()).toISOString(),
      symbols: {}
    })
  }

  const checkCurrentDate = data => {
    return (
      data.currentDate &&
      data.currentDate.split('T')[0] ===
        new Date(Date.now()).toISOString().split('T')[0]
    )
  }

  //effects
  useEffect(() => {
    //componentDidMount
    const restoredData = getStateFromStorage()

    if (restoredData && checkCurrentDate(restoredData)) {
      setData(restoredData)
    } else {
      resetData()
    }
  }, [])

  useEffect(() => {
    if (data.currentDate) {
      saveStateToStorage(data)
    }
  }, [data])

  //render
  const children = React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      getData: () => data
    })
  })

  return <>{children}</>
}

export default DataProvider
