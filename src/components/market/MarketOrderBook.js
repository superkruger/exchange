import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Spinner from '../Spinner'
import DepthChart from './DepthChart'
import { 
  orderBookSelector,
  orderBookLoadedSelector,
  exchangeSelector,
  accountSelector,
  tokenSelector,
  tokenLoadingSelector,
  orderFillingSelector,
  depthChartSelector 
} from '../../store/selectors'
import { fillOrder } from '../../store/interactions'

class MarketOrderBook extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    return (
      <div>
      { this.props.orderBookLoaded ? showOrderBook(this.props) : <Spinner type='div'/> }
      </div>
    )
  }
}

function showOrderBook(props, buys) {
  const { orderBook } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
      <Container>
        <Row>
          <Col sm={12}>
            <div className="card bg-light text-dark">
              <div className="card-body">
                { showDepthChart(props) }
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <div className="card bg-light text-dark">
              <div className="card-header">
                Buy Orders
              </div>
              <div className="card-body">
                { showOrders(props, true) }
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="card bg-light text-dark">
              <div className="card-header">
                Sell Orders
              </div>
              <div className="card-body">
                { showOrders(props, false) }
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  )
}

function showOrders(props, buys) {
  const { orderBook, token } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
    <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%" cellspacing="0">
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

function showDepthChart(props) {
  const { token, depthChart } = props
  return (
    <DepthChart data={depthChart.orders} priceTitle={`ETH/${token.symbol}`} volumeTitle={token.symbol} />
  )
}

function mapStateToProps(state) {
  const orderBookLoaded = orderBookLoadedSelector(state)
  const orderFilling = orderFillingSelector(state)
  const tokenLoading = tokenLoadingSelector(state)

  return {
    orderBookLoaded: !tokenLoading && orderBookLoaded && !orderFilling,
    orderBook: orderBookSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: tokenSelector(state),
    depthChart: depthChartSelector(state)
  }
}

export default connect(mapStateToProps)(MarketOrderBook)


