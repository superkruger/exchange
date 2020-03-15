import React, { Component } from 'react'
import { Navbar, Nav, Dropdown, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import {
  accountSelector, 
  exchangeSelector,
  web3Selector,
  tokenListSelector,
  tokenSelector
} from '../store/selectors'

class Navigation extends Component {

  render() {
    const {
      web3,
      exchange,
      account,
      tokenList,
      token,
      dispatch
    } = this.props

    return (
          <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Exchange</div>

                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseMarket" aria-expanded="false" aria-controls="collapseMarket">
                          <div className="sb-nav-link-icon">
                            <i className="fas fa-columns"></i>
                          </div>
                          Market
                          <div className="sb-sidenav-collapse-arrow">
                            <i className="fas fa-angle-down"></i>
                          </div>
                        </a>
                        <div className="collapse" id="collapseMarket" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                          <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/market-orderbook">Orderbook</Link>
                            <Link className="nav-link" to="/market-trades">Trades</Link>
                          </nav>
                        </div>

                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseBuy" aria-expanded="false" aria-controls="collapseBuy">
                          <div className="sb-nav-link-icon">
                            <i className="fas fa-columns"></i>
                          </div>
                          Buy
                          <div className="sb-sidenav-collapse-arrow">
                            <i className="fas fa-angle-down"></i>
                          </div>
                        </a>
                        <div className="collapse" id="collapseBuy" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                          <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/buy-orders">Buy Orders</Link>
                            <Link className="nav-link" to="/buy-neworder">New Buy Order</Link>
                          </nav>
                        </div>

                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseSell" aria-expanded="false" aria-controls="collapseSell">
                          <div className="sb-nav-link-icon">
                            <i className="fas fa-columns"></i>
                          </div>
                          Sell
                          <div className="sb-sidenav-collapse-arrow">
                            <i className="fas fa-angle-down"></i>
                          </div>
                        </a>
                        <div className="collapse" id="collapseSell" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                          <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/sell-orders">Sell Orders</Link>
                            <Link className="nav-link" to="/sell-neworder">New Sell Order</Link>
                          </nav>
                        </div>

                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePortfolio" aria-expanded="false" aria-controls="collapsePortfolio">
                          <div className="sb-nav-link-icon">
                            <i className="fas fa-columns"></i>
                          </div>
                          Portfolio
                          <div className="sb-sidenav-collapse-arrow">
                            <i className="fas fa-angle-down"></i>
                          </div>
                        </a>
                        <div className="collapse" id="collapsePortfolio" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                          <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/portfolio-orders">My Orders</Link>
                            <Link className="nav-link" to="/portfolio-trades">My Trades</Link>
                          </nav>
                        </div>

                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseFunds" aria-expanded="false" aria-controls="collapseFunds">
                          <div className="sb-nav-link-icon">
                            <i className="fas fa-columns"></i>
                          </div>
                          Funds
                          <div className="sb-sidenav-collapse-arrow">
                            <i className="fas fa-angle-down"></i>
                          </div>
                        </a>
                        <div className="collapse" id="collapseFunds" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                          <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/funds-balance">Balance</Link>
                          </nav>
                        </div>

                    </div>
                </div>
            </nav>
          </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    web3: web3Selector(state),
    exchange: exchangeSelector(state),
    tokenList: tokenListSelector(state),
    token: tokenSelector(state)
  }
}

export default connect(mapStateToProps)(Navigation)
