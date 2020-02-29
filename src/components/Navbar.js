import React, { Component } from 'react'
import { Nav, Dropdown, Form, FormControl, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { 
  addToken
} from '../store/interactions'
import {
  accountSelector, 
  exchangeSelector,
  web3Selector,
  newTokenAddressSelector,
  tokensSelector
} from '../store/selectors'
import { 
  tokenAddressChanged
} from '../store/actions'

class Navbar extends Component {

  constructor() {
    super();
    // this.tokenAddressInput = React.createRef(); 
  }

  render() {
    const {
      web3,
      exchange,
      account,
      newTokenAddress,
      tokens,
      dispatch
    } = this.props

    // let tokenAddressInput = React.createRef();

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
        href=""
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
                addToken(tokenAddressInput.value, web3, account, exchange, dispatch)
              }}>
              <FormControl
                autoFocus
                className="mx-3 my-2 w-auto"
                // ref={tokenAddressInput}
                name="tokenAddress"
                placeholder="token address"
                id="newTokenAddressInput"
                // onChange={e => {
                //   //dispatch(tokenAddressChanged(e.target.value))
                //   setValue(e.target.value)
                // }}
                // value={value}
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
      <Nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            select token
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu}>
            { tokens.map((token) => renderTokenSelect(token)) }
          </Dropdown.Menu>
        </Dropdown>
        <a className="navbar-brand" href="#/">ERC20 Token Exchange</a>
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
              {this.props.account}
            </a>
          </li>
        </ul>
      </Nav>
    )
  }
}

function renderTokenSelect(token) {
  return (
    <Dropdown.Item key="{token.tokenAddress}" eventKey="{token.tokenAddress}">{token.symbol}</Dropdown.Item>
  )
}

function handleTokenAdd(event) {
  event.preventDefault()
  const {
    web3,
    exchange,
    dispatch
  } = this.props

  addToken(event.target.elements.tokenAddress.value, web3, exchange, dispatch)
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    web3: web3Selector(state),
    exchange: exchangeSelector(state),
    newTokenAddress: newTokenAddressSelector(state),
    tokens: tokensSelector(state)
  }
}

export default connect(mapStateToProps)(Navbar)
