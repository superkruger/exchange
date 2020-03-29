import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import DepthChart from './orders/DepthChart'
import MarketOrders from './orders/MarketOrders'
import NewBuyOrder from './orders/NewBuyOrder'
import NewSellOrder from './orders/NewSellOrder'
import MyOrders from './orders/MyOrders'

class Orders extends Component {

  render() {
    return (
      <Container>
        <Row>
          <Col sm={12}>
            <DepthChart />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <MarketOrders buys={false} />
          </Col>
          <Col sm={6}>
            <MarketOrders buys={true} />
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

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(Orders)
