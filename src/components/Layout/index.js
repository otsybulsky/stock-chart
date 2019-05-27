import React, { useContext } from 'react'
import Wrapper from './Wrapper'
import GridLayout from 'react-grid-layout'
import { StoreContext } from 'shared/context'
import Chart from '../Chart'
import s from './Layout.m.scss'
import classNames from 'classnames/bind'
import { confirmAlert } from 'react-confirm-alert'

const cx = classNames.bind(s)

const Layout = ({ size }) => {
  const {
    layout,
    onLayoutChange,
    addItemToLayout,
    removeItemFromLayout,
    cols
  } = useContext(StoreContext)

  const onAdd = () => addItemToLayout()

  const onClose = id => {
    removeItemFromLayout(id)
    // confirmAlert({
    //   title: 'Confirm to close',
    //   message: 'Are you sure to do this?',
    //   buttons: [
    //     {
    //       label: 'Yes',
    //       onClick: () => removeItemFromLayout(id)
    //     },
    //     {
    //       label: 'Cancel'
    //     }
    //   ]
    // })
  }

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
              <div
                className={cx('delete is-small', 'closeButton')}
                onClick={() => onClose(config.i)}
              />
              <Chart />
            </Wrapper>
          )
        })}
      </GridLayout>
    </>
  )
}

export default Layout
