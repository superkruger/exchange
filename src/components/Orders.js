import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import Spinner from './Spinner'
import DepthChart from './orders/DepthChart'
import MarketOrders from './orders/MarketOrders'
import NewBuyOrder from './orders/NewBuyOrder'
import NewSellOrder from './orders/NewSellOrder'
import MyOrders from './orders/MyOrders'
import { 
  orderBookLoadedSelector,
  orderBookSelector,
  tokenSelector,
  depthChartSelector
} from '../store/selectors'

class Orders extends Component {

  render() {
    return (
      <Container>
        <Row>
          <Col sm={12}>
            { this.props.orderBookLoaded ? showDepthChart(this.props) : <Spinner type='div'/> }
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            { this.props.orderBookLoaded ? showOrders(this.props, false) : <Spinner type='div'/> }
          </Col>
          <Col sm={6}>
            { this.props.orderBookLoaded ? showOrders(this.props, true) : <Spinner type='div'/> }
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <NewBuyOrder />
          </Col>
          <Col sm={6}>
            <NewSellOrder />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <MyOrders />
          </Col>
        </Row>
      </Container>
    )
  }
}

function showDepthChart(props) {
  const { token, depthChart } = props
  return (
    <DepthChart data={depthChart.orders} priceTitle={`ETH/${token.symbol}`} volumeTitle={token.symbol} />
  )
}

function showOrders(props, buys) {
  const { orderBook } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
    <MarketOrders buys={buys} orders={orders} />
  )
}

function mapStateToProps(state) {
  const token = tokenSelector(state)
  return {
    orderBookLoaded: token && orderBookLoadedSelector(state),
    orderBook: orderBookSelector(state),
    token: token,
    depthChart: depthChartSelector(state)
  }
}

export default connect(mapStateToProps)(Orders)
