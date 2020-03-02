import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import Chart from 'react-apexcharts'
import { chartOptions } from './PriceChart.config'
import { 
  priceChartLoadedSelector,
  priceChartSelector 
} from '../store/selectors'

class PriceChart extends Component {

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          PriceChart
        </div>
        <div className="card-body">
          { this.props.priceChartLoaded ? showPriceChart(this.props.priceChart) : <Spinner type="div" /> }
        </div>
      </div>
    )
  }
}

const showPriceChart = (priceChart) => {
  return (
    <div className="price-chart">
      <div className="price">
        <h4>ETH/DAPP &nbsp; { priceSymbol(priceChart.lastPriceChange) } &nbsp; { priceChart.lastPrice }</h4>
      </div>
      <Chart options={chartOptions} series={priceChart.series} type='candlestick' width='100%' height='100%'/>
    </div>
  )
}

const priceSymbol = (priceChange) => {
  let output
  if (priceChange === '+') {
    output = <span className="text-success">&#9650;</span>
  } else {
    output = <span className="text-danger">&#9660;</span>
  }
  return output
}

function mapStateToProps(state) {
  return {
    priceChartLoaded: priceChartLoadedSelector(state),
    priceChart: priceChartSelector(state)
  }
}

export default connect(mapStateToProps)(PriceChart)


