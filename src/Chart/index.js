import React, { Component } from 'react'
import Chart from './Chart'
import { getData } from './utils'
import s from './Chart.m.scss'

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

    console.log(s)

    // return <Chart data={this.state.data} />
    return <div className={s.container}>hello</div>
  }
}

export default ChartComponent
