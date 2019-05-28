import React, { useContext } from 'react'
import Wrapper from './Wrapper'
import GridLayout from 'react-grid-layout'
import { StoreContext } from 'shared/context'
import s from './Layout.m.scss'
import classNames from 'classnames/bind'
import Container from './Container'

const cx = classNames.bind(s)

const Layout = ({ size }) => {
  const { layout, onLayoutChange, addItemToLayout, cols } = useContext(
    StoreContext
  )

  const onAdd = () => addItemToLayout()

  if (!size) {
    return null
  }

  return (
    <>
      <div
        className={cx('button is-success is-rounded', 'fixed')}
        onClick={onAdd}
      >
        <span class="icon">
          <i class="fas fa-plus" />
        </span>
      </div>
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
              <Container containerId={config.i} />
            </Wrapper>
          )
        })}
      </GridLayout>
    </>
  )
}

export default Layout
