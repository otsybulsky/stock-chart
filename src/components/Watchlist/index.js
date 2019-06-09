import React, { useState, useEffect, useContext } from 'react'
import s from './Watchlist.m.scss'
import classNames from 'classnames/bind'
import ReactTable from 'react-table'
import _ from 'lodash'
import { StoreContext } from 'shared/context'

const cx = classNames.bind(s)

const columns = [
  {
    Header: '',
    width: 25,
    filterable: false,
    resizable: false,
    sortable: false,
    Aggregated: cellInfo => {
      const needsExpander =
        cellInfo.subRows && cellInfo.subRows.length > 1 ? true : false
      const expanderEnabled = !cellInfo.column.disableExpander
      return needsExpander && expanderEnabled ? (
        <div
          className={classNames('rt-expander', cellInfo.isExpanded && '-open')}
        >
          &bull;
        </div>
      ) : null
    },
    id: 'expander'
  },

  {
    Header: 'Symbol',
    accessor: 'symbol',
    Pivot: row => {
      const { value, subRows } = row
      return (
        <span>{`${value} ${subRows.length > 1 ? subRows.length : ''}`}</span>
      )
    }
  },
  {
    Header: 'Time',
    accessor: 'time',
    aggregate: (values, rows) => _.last(values)
  }
]

const Watchlist = ({ containerId, width, height }) => {
  const { setGroupSymbol } = useContext(StoreContext)

  const [state, setState] = useState({ expanded: {} })
  const [symbol, setSymbol] = useState(null)
  const [data, setData] = useState([
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
      symbol: 'CTRV',
      time: new Date(Date.now()).toLocaleTimeString()
    },
    {
      symbol: 'RWLK',
      time: new Date(Date.now()).toLocaleTimeString()
    }
  ])

  useEffect(() => {
    setTimeout(function fixture() {
      const symbols = ['SPY', 'AAL', 'CTRV', 'RWLK', 'WDC', 'DAL']
      const symbol = symbols[~~(symbols.length * Math.random())]
      setData(data => [
        ...data,
        {
          symbol,
          time: new Date(Date.now()).toLocaleTimeString()
        }
      ])
      setTimeout(fixture, 1000)
    }, 1000)
  }, [])

  useEffect(() => {
    if (symbol) {
      setGroupSymbol(containerId, symbol)
    }
  }, [symbol])

  const onExpandedChange = newExpanded =>
    setState({
      expanded: newExpanded
    })

  const handleTableCellClick = (state, rowInfo, column, instance, ...rest) => {
    if (typeof rowInfo !== 'undefined') {
      const needsExpander =
        rowInfo.subRows && rowInfo.subRows.length > 1 ? true : false
      const expanderEnabled = !column.disableExpander
      const expandedRows = Object.keys(state.expanded)
        .filter(expandedIndex => {
          return state.expanded[expandedIndex] !== false
        })
        .map(Number)

      const rowIsExpanded =
        expandedRows.includes(rowInfo.nestingPath[0]) && needsExpander
          ? true
          : false
      const newExpanded = !needsExpander
        ? state.expanded
        : rowIsExpanded && expanderEnabled
        ? {
            ...state.expanded,
            [rowInfo.nestingPath[0]]: false
          }
        : {
            ...state.expanded,
            [rowInfo.nestingPath[0]]: {}
          }

      return {
        style:
          needsExpander && expanderEnabled
            ? { cursor: 'pointer' }
            : { cursor: 'pointer' },
        onClick: (e, handleOriginal) => {
          // console.log(state, rowInfo, column, instance)
          if (column.id === 'expander') {
            setState({
              expanded: newExpanded
            })
          }
          setSymbol(rowInfo.row.symbol)
        }
      }
    } else {
      return {
        onClick: (e, handleOriginal) => {
          if (handleOriginal) {
            handleOriginal()
          }
        }
      }
    }
  }

  return (
    <ReactTable
      className={cx('container', '-striped -highlight')}
      data={data}
      columns={columns}
      pivotBy={['symbol']}
      getTdProps={handleTableCellClick}
      onExpandedChange={newExpanded => onExpandedChange(newExpanded)}
      expanded={state.expanded}
    />
  )
}

export default Watchlist
