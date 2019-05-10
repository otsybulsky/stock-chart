import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import s from './Chart.m.scss'

import { ChartCanvas, Chart } from 'react-stockcharts'
import { BarSeries, CandlestickSeries } from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'

import { fitWidth } from 'react-stockcharts/lib/helper'

import {
  // lastVisibleItemBasedZoomAnchor,
  rightDomainBasedZoomAnchor
  // mouseBasedZoomAnchor
} from 'react-stockcharts/lib/utils/zoomBehavior'

import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY
} from 'react-stockcharts/lib/coordinates'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { OHLCTooltip } from 'react-stockcharts/lib/tooltip'

const cx = classNames.bind(s)

const candlesAppearance = {
  wickStroke: '#000000',
  fill: function fill(d) {
    return d.close > d.open ? 'green' : 'red'
  },
  stroke: '#000000',
  candleStrokeWidth: 1,
  widthRatio: 0.8,
  opacity: 1
}

class CandleStickStockScaleChart extends React.Component {
  componentDidMount() {
    this.node.subscribe('myUniqueId', { listener: this.handleEvents })
  }

  componentWillUnmount() {
    this.node.unsubscribe('myUniqueId')
  }

  handleEvents = (type, moreProps, state) => {
    const {
      updateConfig,
      config: { chartActive }
    } = this.props

    const mouseTypes = {
      mouseEnter: 'mouseenter',
      mouseLeave: 'mouseleave'
    }
    const types = ['zoom', 'pan', 'paned']

    if (type === mouseTypes.mouseEnter) {
      updateConfig({ chartActive: true })
    }

    if (type === mouseTypes.mouseLeave) {
      updateConfig({ chartActive: false })
    }

    if (chartActive && types.includes(type)) {
      const { xScale } = moreProps
      updateConfig({ xExtents: xScale.domain() })
    }
  }

  render() {
    const {
      config: { data, xScale, xAccessor, displayXAccessor, xExtents }
    } = this.props
    if (!data) {
      return null
    }
    const { type, height, width, ratio } = this.props

    const margin = { left: 0, right: 50, top: 10, bottom: 10 }
    const gridHeight = height - margin.top - margin.bottom
    const gridWidth = width - margin.left - margin.right

    const yGrid = {
      innerTickSize: -1 * gridWidth,
      tickStrokeDasharray: 'Dot',
      tickStrokeOpacity: 0.2,
      tickStrokeWidth: 1
    }
    const xGrid = {
      innerTickSize: -1 * gridHeight,
      tickStrokeDasharray: 'Dot',
      tickStrokeOpacity: 0.2,
      tickStrokeWidth: 1
    }

    return (
      <ChartCanvas
        ref={node => {
          this.node = node
        }}
        height={height}
        ratio={ratio}
        width={width}
        margin={margin}
        padding={{ left: 10, right: 10 }}
        type={type}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        zoomAnchor={rightDomainBasedZoomAnchor}
      >
        <Chart
          id={1}
          height={height * 0.75}
          yExtents={d => [d.high, d.low]}
          padding={{ top: 20, bottom: 10 }}
        >
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} {...xGrid} />
          <YAxis axisAt="right" orient="right" ticks={5} {...yGrid} />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.2f')}
          />
          <CandlestickSeries />
          <OHLCTooltip
            className={cx('chart-tooltip')}
            fontSize={14}
            origin={[8, 0]}
          />
          <CandlestickSeries {...candlesAppearance} />
        </Chart>

        <Chart
          id={2}
          height={height * 0.2}
          yExtents={d => d.volume}
          origin={(w, h) => [0, h * 0.78]}
        >
          <XAxis axisAt="bottom" orient="bottom" ticks={15} {...xGrid} />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            tickFormat={format('.0s')}
            {...yGrid}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%H:%M')}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.4s')}
          />

          <BarSeries
            yAccessor={d => d.volume}
            fill={d => (d.close > d.open ? 'green' : 'red')}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    )
  }
}

CandleStickStockScaleChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
}

CandleStickStockScaleChart.defaultProps = {
  type: 'hybrid'
}
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart)

export default CandleStickStockScaleChart
