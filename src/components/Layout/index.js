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
  const { layout, onLayoutChange, removeItemFromLayout } = useContext(
    StoreContext
  )

  const onClose = id => {
    confirmAlert({
      title: 'Confirm to close',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => removeItemFromLayout(id)
        },
        {
          label: 'Cancel'
        }
      ]
    })
  }

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
            <div
              className={cx('delete is-small', 'closeButton')}
              onClick={() => onClose(config.i)}
            />
            <Chart />
          </Wrapper>
        )
      })}
    </GridLayout>
  )
}

export default Layout
