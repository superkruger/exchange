import React, { Component } from 'react'
import { connect } from 'react-redux'
import toast from 'toasted-notes' 
import 'toasted-notes/src/styles.css'
import Notification from '../Notification'
import Spinner from '../Spinner'
import {
  makeSellOrder 
} from '../../store/interactions'
import {
  accountSelector, 
  exchangeSelector, 
  tokenSelector, 
  web3Selector,
  sellOrderSelector
} from '../../store/selectors'
import {
  sellOrderAmountChanged,
  sellOrderPriceChanged
} from '../../store/actions'

class NewSellOrder extends Component {
	
  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          Sell
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
    sellOrder,
    showSellTotal,
    dispatch
  } = props
  return (
    
    <form onSubmit={(event) => {
      event.preventDefault()
      makeSellOrder(sellOrder, account, web3, token, exchange, dispatch, (success) => {
        if (!success) {
          toast.notify(() => <Notification title="Could not make sell-order" type="danger" />)
        }
      })
    }}>
      <div className="form-group small">
        <label>Sell Amount ({token.symbol})</label>
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
  )
}

function mapStateToProps(state) {
  const sellOrder = sellOrderSelector(state)
  const token = tokenSelector(state)

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: token,
    web3: web3Selector(state),
    sellOrder,
    showForm: token && !sellOrder.making,
    showSellTotal: sellOrder.amount && sellOrder.price
  }
}

export default connect(mapStateToProps)(NewSellOrder)


