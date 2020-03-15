import React, { Component } from 'react'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip, Container, Row, Col } from 'react-bootstrap'
import Spinner from '../Spinner'
import { 
  orderBookSelector,
  orderBookLoadedSelector,
  exchangeSelector,
  accountSelector,
  orderFillingSelector,
  tokenSelector
} from '../../store/selectors'
import { fillOrder } from '../../store/interactions'

class BuyOrders extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    return (
      <div>
      { this.props.orderBookLoaded ? showOrderTable(this.props, false) : <Spinner type='div'/> }
      </div>
    )
  }
}

function showOrderTable(props, buys) {
  const { orderBook } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
      <div className="card bg-light text-dark">
        <div className="card-body">
          { showOrders(props, buys) }
        </div>
      </div>
  )
}

function showOrders(props, buys) {
  const { orderBook, token } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
    <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%">
      <thead>
        <tr>
          <th>{token.symbol}</th>
          <th>ETH/{token.symbol}</th>
          <th>ETH</th>
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

  return (
    <OverlayTrigger
      key={order.id}
      placement='auto'
      overlay={
        <Tooltip id={order.id}>
          {`Click here to ${order.orderFillAction}`}
        </Tooltip>
      }
    >
      <tr key={order.id}
          className="order-book-order"
          onClick={(e) => {
            fillOrder(order, account, exchange, dispatch)
          }}
      >
        <td>{order.tokenAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
      </tr>
    </OverlayTrigger>
  )
}

function mapStateToProps(state) {
  const orderBookLoaded = orderBookLoadedSelector(state)
  const orderFilling = orderFillingSelector(state)

  return {
    orderBookLoaded: orderBookLoaded && !orderFilling,
    orderBook: orderBookSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: tokenSelector(state)
  }
}

export default connect(mapStateToProps)(BuyOrders)


