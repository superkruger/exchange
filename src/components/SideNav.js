import React, { Component } from 'react'
import { Navbar, Nav, Dropdown, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import { 
  addToken,
  selectToken
} from '../store/interactions'
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

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
        href="/#"
        ref={ref}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
        &#x25bc;
      </a>
    ));

    const CustomMenu = React.forwardRef(
      ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = React.useState('');
        
        return (
          <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
          >
            <Form noValidate onSubmit={(event) => {
                event.preventDefault()
                let tokenAddressInput = document.getElementById('newTokenAddressInput')
                console.log(`newTokenAddress ${tokenAddressInput.value}`)
                addToken(tokenAddressInput.value, tokenList, web3, account, exchange, dispatch)
              }}>
              <FormControl
                autoFocus
                className="mx-3 my-2 w-auto"
                name="tokenAddress"
                placeholder="token address"
                id="newTokenAddressInput"
              />
              <Button variant="primary" type="submit">
                Add Token
              </Button>
            </Form>
            <ul className="list-unstyled">
              {React.Children.toArray(children).filter(
                child =>
                  !value || child.props.children.toLowerCase().startsWith(value),
              )}
            </ul>
          </div>
        );
      },
    );

    return (
          <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
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
                            <Link className="nav-link" to="/market/orderbook">Orderbook</Link>
                            <Link className="nav-link" to="/market/trades">Trades</Link>
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
                            <Link className="nav-link" to="/buy/orders">Buy Orders</Link>
                            <Link className="nav-link" to="/buy/neworder">New Buy Order</Link>
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
                            <Link className="nav-link" to="/sell/orders">Sell Orders</Link>
                            <Link className="nav-link" to="/sell/neworder">New Sell Order</Link>
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
                            <Link className="nav-link" to="/portfolio/orders">My Orders</Link>
                            <Link className="nav-link" to="/portfolio/trades">My Trades</Link>
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
                            <Link className="nav-link" to="/funds/balance">Balance</Link>
                          </nav>
                        </div>

                    </div>
                </div>
            </nav>
          </div>
    )
  }
}

function renderTokenSelect(token, props) {
  const {
    tokenList,
    web3,
    exchange,
    account, 
    dispatch
  } = props

  return (
    <Dropdown.Item 
      key={token.tokenAddress} 
      eventKey={token.tokenAddress} 
      onSelect={eKey => selectToken(eKey, tokenList, account, exchange, web3, dispatch)}>{token.symbol}</Dropdown.Item>
  )
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
