import React, { useContext } from 'react'
import s from './Container.m.scss'
import classNames from 'classnames/bind'
import { StoreContext } from 'shared/context'
import { confirmAlert } from 'react-confirm-alert'
import Chart from 'components/Chart'

const cx = classNames.bind(s)

const Container = ({ containerId, width, height }) => {
  const { removeItemFromLayout } = useContext(StoreContext)

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

  return (
    <div className={cx('container')}>
      <div
        className={cx('delete is-small', 'closeButton')}
        onClick={() => onClose(containerId)}
      />
      {containerId}
    </div>
  )
}

export default Container
