import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { 
  makeBuyOrder,
  makeSellOrder 
} from '../../store/interactions'
import {
  accountSelector, 
  exchangeSelector, 
  tokenSelector, 
  web3Selector,
  buyOrderSelector,
  sellOrderSelector
} from '../../store/selectors'
import { 
  buyOrderAmountChanged,
  buyOrderPriceChanged,
  sellOrderAmountChanged,
  sellOrderPriceChanged
} from '../../store/actions'

class NewOrder extends Component {
	
  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          NewOrder
        </div>
        <div className="card-body">
          { this.props.showForm ? showForm(this.props) : <Spinner type='div' /> }
        </div>
      </div>
    )
  }
}

const showForm = (props) => {
  const {
    web3,
    exchange,
    token,
    account,
    buyOrder,
    sellOrder,
    showBuyTotal,
    showSellTotal,
    dispatch
  } = props
  return (
    <Tabs defaultActiveKey="buy" className="bg-light text-dark">
      <Tab eventKey="buy" title="Buy" className="bg-light">
        <form onSubmit={(event) => {
          event.preventDefault()
          makeBuyOrder(buyOrder, account, web3, token, exchange, dispatch)
        }}>
          <div className="form-group small">
            <label>Buy Amount ({token.symbol})</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Buy Amount"
                onChange={(e) => {dispatch(buyOrderAmountChanged(e.target.value))}}
                className="form-control form-control-sm bg-light text-dark"
                required
              />
            </div>
          </div>
          <div className="form-group small">
            <label>Buy Price</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Buy Price"
                onChange={(e) => {dispatch(buyOrderPriceChanged(e.target.value))}}
                className="form-control form-control-sm bg-light text-dark"
                required
              />
            </div>
          </div>
          <button type="Submit" className="btn btn-primary btn-block btn-sm">Buy Order</button>
          { showBuyTotal ? <small>Total: {buyOrder.amount * buyOrder.price} ETH</small> : null }
        </form>
      </Tab>
      <Tab eventKey="sell" title="Sell" className="bg-light">
        <form onSubmit={(event) => {
          event.preventDefault()
          makeSellOrder(sellOrder, account, web3, token, exchange, dispatch)
        }}>
          <div className="form-group small">
            <label>Sell Amount (DAPP)</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Sell Amount"
                onChange={(e) => {dispatch(sellOrderAmountChanged(e.target.value))}}
                className="form-control form-control-sm bg-light text-dark"
                required
              />
            </div>
          </div>
          <div className="form-group small">
            <label>Sell Price</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Sell Price"
                onChange={(e) => {dispatch(sellOrderPriceChanged(e.target.value))}}
                className="form-control form-control-sm bg-light text-dark"
                required
              />
            </div>
          </div>
          <button type="Submit" className="btn btn-primary btn-block btn-sm">Sell Order</button>
          { showSellTotal ? <small>Total: {sellOrder.amount * sellOrder.price} ETH</small> : null }
        </form>
      </Tab>
    </Tabs>
  )
}

function mapStateToProps(state) {
  const buyOrder = buyOrderSelector(state)
  const sellOrder = sellOrderSelector(state)

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    buyOrder,
    sellOrder,
    showForm: !buyOrder.making && !sellOrder.making,
    showBuyTotal: buyOrder.amount && buyOrder.price,
    showSellTotal: sellOrder.amount && sellOrder.price
  }
}

export default connect(mapStateToProps)(NewOrder)


