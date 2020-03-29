import React, { Component } from 'react'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Identicon from 'identicon.js'
import Spinner from '../Spinner'
import { 
  exchangeSelector,
  accountSelector,
  tokenSelector,
  orderBookLoadedSelector,
  orderBookSelector
} from '../../store/selectors'
import { fillOrder } from '../../store/interactions'

class MarketOrders extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          {this.props.buys ? 'Buy' : 'Sell'} Orders
        </div>
        <div className="card-body">
          { this.props.orderBookLoaded ? showOrders(this.props) : <Spinner type='div'/> }
        </div>
      </div>
    )
  }
}

function showOrders(props) {
  const { orderBook, token, buys } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
    <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%">
      <thead>
        <tr>
          <th>{token.symbol}</th>
          <th>ETH/{token.symbol}</th>
          <th>ETH</th>
          <th>{buys ? 'Buyer' : 'Seller'}</th>
        </tr>
      </thead>
      <tbody>
        { orders.map((order) => renderOrder(order, props)) }
      </tbody>
    </table>
  )
}

function renderOrder(order, props) {
  const { account, exchange, dispatch } = props
  const ownOrder = (account === order.user)

  return (
      <OverlayTrigger
        key={order.id}
        placement='auto'
        overlay={
          <Tooltip id={order.id}>
            {!ownOrder ? `Click here to ${order.orderFillAction} ${order.user}` : `Cannot ${order.orderFillAction} yourself`}
          </Tooltip>
        }
      >
      <tr key={order.id}
          className="order-book-order"
            onClick={(e) => {
              if (!ownOrder) {
                fillOrder(order, account, exchange, dispatch)
              }
            }}
      >
        <td>{order.tokenAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
        <td>
          <img
            className="ml-2"
            width='15'
            height='15'
            src={`data:image/png;base64,${new Identicon(order.user, 15).toString()}`}
            alt=""
          />
        </td>
      </tr>
    </OverlayTrigger>
  )
}

function mapStateToProps(state) {
  const token = tokenSelector(state)
  return {
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: token,
    orderBookLoaded: token && orderBookLoadedSelector(state),
    orderBook: orderBookSelector(state),
  }
}

export default connect(mapStateToProps)(MarketOrders)


