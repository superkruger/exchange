import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col  } from 'react-bootstrap'
import PriceChart from './trades/PriceChart'
import MyTrades from './trades/MyTrades'
import MarketTrades from './trades/MarketTrades'

class Trades extends Component {

  render() {
    return (
      <Container>
        <Row>
          <Col sm={12}>
            <PriceChart />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <MyTrades />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <MarketTrades />
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

export default connect(mapStateToProps)(Trades)
