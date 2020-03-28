import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import Orders from './Orders'
import Trades from './Trades'
import Funds from './Funds'

class Content extends Component {

  render() {
    return (
      <div className="content">
        <Tabs defaultActiveKey="orders" className="bg-light text-dark">
          <Tab eventKey="orders" title="Orders" className="bg-light">
            <Orders />
          </Tab>
          <Tab eventKey="trades" title="Trades" className="bg-light">
            <Trades />
          </Tab>
          <Tab eventKey="funds" title="Funds" className="bg-light">
            <Funds />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(Content)
