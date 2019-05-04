import React from 'react'

const DataProvider = props => {
  const children = React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      getSymbol: symbol => symbol
    })
  })

  return <>{children}</>
}

export default DataProvider
