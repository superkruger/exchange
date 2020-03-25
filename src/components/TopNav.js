import React, { Component } from 'react'
import { Navbar, Nav, Dropdown, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import Routes from "./Routes"
import Identicon from 'identicon.js';
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
import {
  sideNavShowHideToggled
} from '../store/actions'

class TopNav extends Component {

  constructor(props) {    
    super(props)
    this.toggleSidenav = this.toggleSidenav.bind(this)
  }

  toggleSidenav() {
    const {
      dispatch
    } = this.props
    dispatch(sideNavShowHideToggled())
  }

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
            <FormControl
              autoFocus
              className="mx-3 my-2 w-auto"
              placeholder="Type to filter..."
              onChange={e => setValue(e.target.value)}
              value={value}
            />
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
        <nav className="sb-topnav navbar navbar-expand navbar-light bg-light">
            <Link className="navbar-brand" to='/'>Kouga</Link>
            <button className="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#" 
              onClick={
                this.toggleSidenav
              }>
              <i className="fas fa-bars"></i>
            </button>

            <Dropdown className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
              <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                {token ? token.symbol : "select token"}
              </Dropdown.Toggle>
              <Dropdown.Menu as={CustomMenu}>
                { tokenList.map((token) => renderTokenSelect(token, this.props)) }
              </Dropdown.Menu>
            </Dropdown>

            <ul className="navbar-nav ml-auto ml-md-0">
                <li className="nav-item dropdown">
                    { this.props.account
                      ? <a className="nav-link dropdown-toggle" id="userDropdown" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <img
                            className="ml-2"
                            width='30'
                            height='30'
                            src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                            alt=""
                          />
                        </a>
                        
                      : <span></span>
                    }
                    
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                        <div className="dropdown-item">{this.props.account}</div>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to='/settings'>Settings</Link>
                    </div>
                </li>
            </ul>
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

export default connect(mapStateToProps)(TopNav)
