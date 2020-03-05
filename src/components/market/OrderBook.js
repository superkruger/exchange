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
  orderFillingSelector,
  depthChartSelector 
} from '../../store/selectors'
import { fillOrder } from '../../store/interactions'

class OrderBook extends Component {
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
                { showDepthChart(props.depthChart) }
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
  const { orderBook } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
    <table>
      <thead>
        <tr>
          <th>DAPP</th>
          <th>ETH/DAPP</th>
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

function showDepthChart(depthChart) {
    console.log("DepthChart", depthChart.orders)
    return (
      <DepthChart data={depthChart.orders} priceTitle="ETH/DAPP" volumeTitle="DAPP" />
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
    depthChart: depthChartSelector(state)
  }
}

export default connect(mapStateToProps)(OrderBook)


