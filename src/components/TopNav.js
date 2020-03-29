import React, { Component } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import Identicon from 'identicon.js'

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
      account
    } = this.props

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

            <div className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
            </div>

            <div className="navbar-nav ml-auto ml-md-0">
                    { account
                      ? <OverlayTrigger
                          key={account}
                          placement='auto'
                          overlay={
                            <Tooltip id={account}>
                              {`${account}`}
                            </Tooltip>
                          }
                        >
                          <a className="nav-link" href="/#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img
                              className="ml-2"
                              width='30'
                              height='30'
                              src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                              alt=""
                            />
                          </a>
                        </OverlayTrigger>
                        
                      : <span></span>
                    }
                    
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

export default connect(mapStateToProps)(TopNav)
