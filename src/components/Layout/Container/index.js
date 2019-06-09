import React, { useContext } from 'react'
import s from './Container.m.scss'
import classNames from 'classnames/bind'
import { StoreContext } from 'shared/context'
import { confirmAlert } from 'react-confirm-alert'
import Chart from 'components/Chart'
import Watchlist from 'components/Watchlist'
import DropdownSelect from 'shared/components/DropdownSelect'
import { containerType } from 'shared/types'

const cx = classNames.bind(s)
const containerTypes = Object.values(containerType)

const Container = ({ containerId, width, height }) => {
  const {
    removeItemFromLayout,
    fullscreen,
    onFullscreenContainer,
    onRestoreLayout,
    getGroups,
    setContainerGroup,
    setContainerType,
    containerStore
  } = useContext(StoreContext)

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

  const showContent = () => {
    switch (containerStore[containerId].typeId) {
      case containerType.Chart.id:
        return <Chart {...{ containerId, width, height: height - 20 }} />

      case containerType.WatchList.id:
        return <Watchlist {...{ containerId, width, height }} />

      default:
        return null
    }
  }

  const onGroupChange = groupId => setContainerGroup(containerId, groupId)
  const onTypeChange = typeId => setContainerType(containerId, typeId)

  const groups = getGroups()

  return (
    <div className={cx('container')}>
      <div className={s.navbar}>
        <div className={s.leftPart}>
          <DropdownSelect
            value={containerStore[containerId].typeId}
            items={containerTypes}
            onChange={onTypeChange}
          />
          <DropdownSelect
            value={containerStore[containerId].groupId}
            items={groups}
            onChange={onGroupChange}
          />
        </div>

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

      <div className={s.content}>{showContent()}</div>
    </div>
  )
}

export default Container
