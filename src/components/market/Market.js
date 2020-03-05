import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link, useRouteMatch } from "react-router-dom";
import { connect } from 'react-redux'
import Routes from "./Routes"

class Market extends Component {

  render() {
    return (
      <NavItems />
    )
  }
}

function NavItems() {
  let { path, url } = useRouteMatch();
  return (

    <div className="content">
      <Navbar bg="light" expand="lg">
        <Nav variant="pills" className="flex-column" defaultActiveKey="orderbook">
          <Nav.Item>
            <Nav.Link as={Link} eventKey="orderbook" to={`${url}/orderbook`}>Orderbook</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} eventKey="trades" to={`${url}/trades`}>Trades</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Routes />
    </div>
  )
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(Market)
