import React, { Component } from 'react'
import classNames from 'classnames/bind'
import Chart from './Chart'
import { getData } from './utils'
import s from './Chart.m.scss'

const cx = classNames.bind(s)

class ChartComponent extends React.Component {
  componentDidMount() {
    getData().then(data => {
      this.setState({ data })
    })
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>
    }

    // return <Chart data={this.state.data} />
    return <div className={cx('container', { red: true })}>hello</div>
  }
}

export default ChartComponent
