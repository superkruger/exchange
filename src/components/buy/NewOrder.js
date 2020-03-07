import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { 
  makeBuyOrder
} from '../../store/interactions'
import {
  accountSelector, 
  exchangeSelector, 
  tokenSelector, 
  web3Selector,
  buyOrderSelector
} from '../../store/selectors'
import { 
  buyOrderAmountChanged,
  buyOrderPriceChanged
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
    showBuyTotal,
    dispatch
  } = props
  return (
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
  )
}

function mapStateToProps(state) {
  const buyOrder = buyOrderSelector(state)

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    buyOrder,
    showForm: !buyOrder.making,
    showBuyTotal: buyOrder.amount && buyOrder.price
  }
}

export default connect(mapStateToProps)(NewOrder)


