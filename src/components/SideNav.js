import React, { Component } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import toast from 'toasted-notes' 
import 'toasted-notes/src/styles.css'
import Notification from './Notification'
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

class SideNav extends Component {

  handleOnSelect = (row, isSelect) => {
    const {
      web3,
      exchange,
      account,
      tokenList,
      dispatch
    } = this.props

    selectToken(row.tokenAddress, tokenList, account, exchange, web3, dispatch, (success) => {
      if (!success) {
        toast.notify(() => <Notification title="Could not select token" type="danger" />)
      }
    })
  }

  render() {
    const {
      web3,
      exchange,
      account,
      tokenList,
      dispatch
    } = this.props

    return (
          <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-light small" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                      { showTokens(this) }
                    </div>
                </div>
                <div className="card bg-light text-dark">
              <div className="card-header">
                Add new ERC20 Token
              </div>
              <div className="card-body">
                  <Form noValidate onSubmit={(event) => {
                    event.preventDefault()
                    let tokenAddressInput = document.getElementById('newTokenAddressInput')
                    addToken(tokenAddressInput.value, tokenList, web3, account, exchange, dispatch, (success) => {
                      if (!success) {
                        toast.notify(() => <Notification title="Could not add new token" type="danger" />)
                      }
                    })
                  }}>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Control autoFocus name="tokenAddress" placeholder="Token contract address" id="newTokenAddressInput" />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Button variant="primary" type="submit">
                        Add Token
                      </Button>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>
            </div>
            </nav>
          </div>
    )
  }
}

function showTokens(component) {
  const { 
    tokenList
  } = component.props

  const { SearchBar } = Search;

  const tokens = tokenList.map((token) => {
    return {
      tokenAddress: token.tokenAddress,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals
    }
  });
  const columns = [{
    dataField: 'symbol',
    text: 'Symbol',
    sort: true
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true
  }, {
    dataField: 'decimals',
    text: 'Decimals'
  }];

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: '#aaa',
    onSelect: component.handleOnSelect
  };

  return (
    <ToolkitProvider
      keyField="symbol"
      data={ tokens }
      columns={ columns }
      search
    >
      {
        props => (
          <div>
            <SearchBar { ...props.searchProps } placeholder='filter tokens'/>
            <BootstrapTable
              { ...props.baseProps }
              selectRow={ selectRow }
              classes="table table-sm"
              hover
              condensed
            />
          </div>
        )
      }
    </ToolkitProvider>

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

export default connect(mapStateToProps)(SideNav)
