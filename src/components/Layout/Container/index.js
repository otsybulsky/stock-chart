import React, { useContext } from 'react'
import s from './Container.m.scss'
import classNames from 'classnames/bind'
import { StoreContext } from 'shared/context'
import { confirmAlert } from 'react-confirm-alert'
import Chart from 'components/Chart'

const cx = classNames.bind(s)

const Container = ({ containerId, width, height }) => {
  const {
    removeItemFromLayout,
    fullscreen,
    onFullscreenContainer,
    onRestoreLayout
  } = useContext(StoreContext)

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
      <div className={s.navbar}>
        <div className={s.leftPart} />

        <div className={s.rightPart}>
          {fullscreen && (
            <div
              className="button is-small"
              onClick={() => onRestoreLayout(containerId)}
            >
              <span className="icon">
                <i className="fas fa-compress" />
              </span>
            </div>
          )}
          {!fullscreen && (
            <div
              className="button is-small"
              onClick={() => {
                onFullscreenContainer(containerId)
              }}
            >
              <span className="icon">
                <i className="fas fa-expand" />
              </span>
            </div>
          )}
          {!fullscreen && (
            <div
              className={cx('delete is-small')}
              onClick={() => onClose(containerId)}
            />
          )}
        </div>
      </div>

      <div className={s.content}>
        <Chart {...{ containerId, width, height: height - 20 }} />
      </div>
    </div>
  )
}

export default Container
