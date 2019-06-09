import React from 'react'
import s from './Watchlist.m.scss'
import classNames from 'classnames/bind'
import ReactTable from 'react-table'
import _ from 'lodash'

const cx = classNames.bind(s)

const data = [
  {
    symbol: 'SPY',
    time: new Date(Date.now()).toLocaleTimeString()
  },
  {
    symbol: 'SPY',
    time: new Date(Date.now()).toLocaleTimeString()
  },
  {
    symbol: 'AAL',
    time: new Date(Date.now()).toLocaleTimeString()
  },
  {
    symbol: 'DAL',
    time: new Date(Date.now()).toLocaleTimeString()
  },
  {
    symbol: 'WDC',
    time: new Date(Date.now()).toLocaleTimeString()
  }
]

const columns = [
  {
    Header: 'Symbol',
    accessor: 'symbol'
  },
  {
    Header: 'Time',
    accessor: 'time',
    aggregate: (values, rows) => _.last(values)
  }
]

const Watchlist = ({ containerId, width, height }) => {
  return (
    <ReactTable
      className={cx('container', '-striped -highlight')}
      data={data}
      columns={columns}
      pivotBy={['symbol']}
    />
  )
}

export default Watchlist
