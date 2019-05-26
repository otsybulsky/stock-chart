import React, { useContext } from 'react'
import Wrapper from './Wrapper'
import GridLayout from 'react-grid-layout'
import { StoreContext } from 'shared/context'
import Chart from '../Chart'

const Layout = ({ size }) => {
  const { layout, onLayoutChange } = useContext(StoreContext)

  const cols = 36

  if (!size) {
    return null
  }

  return (
    <GridLayout
      className="layout"
      cols={cols}
      rowHeight={size.height / cols}
      width={size.width}
      onLayoutChange={onLayoutChange}
    >
      {layout.map(config => {
        return (
          <Wrapper key={config.i} data-grid={config}>
            <Chart />
          </Wrapper>
        )
      })}
    </GridLayout>
  )
}

export default Layout
