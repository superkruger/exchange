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
      <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand><Link to="/">Kouga Exchange</Link></Navbar.Brand>
          <Nav variant="tabs" className="navbar navbar-expand-lg navbar-light bg-light" defaultActiveKey="market">
            <Nav.Item>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                  {token ? token.symbol : "select token"}
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}>
                  { tokenList.map((token) => renderTokenSelect(token, this.props)) }
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
            <Nav.Link as={Link} eventKey="market" to="/market">Market</Nav.Link>
            <Nav.Link as={Link} eventKey="buy" to="/buy">Buy</Nav.Link>
            <Nav.Link as={Link} eventKey="sell" to="/sell">Sell</Nav.Link>
            <Nav.Link as={Link} eventKey="portfolio" to="/portfolio">Portfolio</Nav.Link>
            <Nav.Link as={Link} eventKey="funds" to="/funds">Funds</Nav.Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a
                  className="nav-link small"
                  href={`https://etherscan.io/address/${this.props.account}`}
                  target="_blank"
                  rel="noopener noreferrer">
                    <Container>
                      <Row>
                        <Col sm={2}>
                          <img src="https://robohash.org/{this.props.account}.png?size=30x30"/>
                        </Col>
                        <Col sm={10}>
                          {this.props.account}
                        </Col>
                      </Row>
                    </Container>
                </a>
              </li>
            </ul>
          </Nav>
      </Navbar>
      
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
