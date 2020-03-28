import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col  } from 'react-bootstrap'
import ETHFunds from './funds/ETHFunds'
import TokenFunds from './funds/TokenFunds'

class Funds extends Component {

  render() {
    return (
      <Container>
        <Row>
          <Col sm={12}>
            <ETHFunds />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <TokenFunds />
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

export default connect(mapStateToProps)(Funds)
