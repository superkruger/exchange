import React, { Component } from 'react'
import { connect } from 'react-redux'
import Chart from 'react-apexcharts'
import Spinner from '../Spinner'
import { chartOptions } from './PriceChart.config'
import { 
  tokenSelector,
  tokenLoadingSelector,
  priceChartLoadedSelector,
  priceChartSelector
} from '../../store/selectors'

class PriceChart extends Component {

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-body">
          { this.props.priceChartLoaded ? showPriceChart(this.props) : <Spinner type="div" /> }
        </div>
      </div>
    )
  }
}

const showPriceChart = (props) => {
  const {token, priceChart} = props

  return (
    <div className="price-chart">
      <div className="price">
        <h4>ETH/{token.symbol} &nbsp; { priceSymbol(priceChart.lastPriceChange) } &nbsp; { priceChart.lastPrice }</h4>
      </div>
      <Chart options={chartOptions} series={priceChart.series} type='candlestick' width='100%' height='200px'/>
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
  const tokenLoading = tokenLoadingSelector(state)
  const priceChartLoaded = priceChartLoadedSelector(state)
    
  return {
    token: tokenSelector(state),
    priceChartLoaded: priceChartLoaded && !tokenLoading,
    priceChart: priceChartSelector(state)
  }
}

export default connect(mapStateToProps)(PriceChart)


