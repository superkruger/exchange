import React, { Component } from 'react'
import { connect } from 'react-redux'
import Balance from './Balance'
import NewOrder from './NewOrder'
import OrderBook from './OrderBook'
import PriceChart from './PriceChart'
import MyTransactions from './MyTransactions'
import Trades from './Trades'

class Content extends Component {

  componentWillMount() {
  }

  async loadBlockchainData(dispatch) {
  }

  render() {
    return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
        </div>
        <MyTransactions/>
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
  }
}

export default connect(mapStateToProps)(Content)
