import React, { Component } from 'react'
import { connect } from 'react-redux'
import Balance from './Balance'
import NewOrder from './NewOrder'
import OrderBook from './OrderBook'
import PriceChart from './PriceChart'
import MyTransactions from './MyTransactions'
import Trades from './Trades'
import { loadAllOrders } from '../store/interactions'
import { exchangeSelector } from '../store/selectors'

class Content extends Component {

  componentDidMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    loadAllOrders(this.props.exchange, dispatch)
  }

  render() {
    return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
        </div>
        <div className="vertical">
          <MyTransactions/>
        </div>
        <div className="vertical-split">
          <PriceChart/>
          <OrderBook/>
        </div>
        <div className="vertical">
          <Trades/> 
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    exchange: exchangeSelector(state)
  }
}

export default connect(mapStateToProps)(Content)
