import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { 
  loadBalances,
  depositEther,
  withdrawEther,
  depositToken,
  withdrawToken 
} from '../../store/interactions'
import {
  accountSelector, 
  exchangeSelector, 
  tokenSelector, 
  tokenLoadingSelector, 
  web3Selector,
  balancesLoadingSelector,
  etherBalanceSelector,
  tokenBalanceSelector,
  exchangeEtherBalanceSelector,
  exchangeTokenBalanceSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector,
  tokenDepositAmountSelector,
  tokenWithdrawAmountSelector
} from '../../store/selectors'
import { 
  etherDepositAmountChanged,
  etherWithdrawAmountChanged,
  tokenDepositAmountChanged,
  tokenWithdrawAmountChanged
} from '../../store/actions'

class FundsBalance extends Component {
	componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
  }

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          Balance
        </div>
        <div className="card-body">
          {this.props.showForm ? showForm(this.props) : <Spinner type="div" />}
        </div>
      </div>
    )
  }
}

function showForm(props) {
  const {
    web3,
    exchange,
    token,
    account,
    etherBalance,
    tokenBalance,
    exchangeEtherBalance,
    exchangeTokenBalance,
    dispatch,
    etherDepositAmount,
    etherWithdrawAmount,
    tokenDepositAmount,
    tokenWithdrawAmount
  } = props
  return(
    <Tabs defaultActiveKey="deposit" className="bg-light text-dark">
      <Tab eventKey="deposit" title="Deposit" className="bg-light">
        <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%" cellspacing="0">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>{etherBalance}</td>
              <td>{exchangeEtherBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className="row" onSubmit={(event) => {
          event.preventDefault()
          depositEther(etherDepositAmount, account, web3, exchange, dispatch)
        }}>
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder="ETH Amount"
              onChange={(e) => {dispatch(etherDepositAmountChanged(e.target.value))}}
              className="form-control form-control-sm bg-light text-dark"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="Submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
          </div>
        </form>

        <table className="table table-light table-sm small">
          
          <tbody>
            <tr>
              <td>{token.symbol}</td>
              <td>{tokenBalance}</td>
              <td>{exchangeTokenBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className="row" onSubmit={(event) => {
          event.preventDefault()
          depositToken(tokenDepositAmount, account, web3, token, exchange, dispatch)
        }}>
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder={`${token.symbol} Amount`}
              onChange={(e) => {dispatch(tokenDepositAmountChanged(e.target.value))}}
              className="form-control form-control-sm bg-light text-dark"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="Submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
          </div>
        </form>
        

      </Tab>
      <Tab eventKey="withdraw" title="Withdraw" className="bg-light">
        <table className="table table-light table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>{etherBalance}</td>
              <td>{exchangeEtherBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className="row" onSubmit={(event) => {
          event.preventDefault()
          withdrawEther(etherWithdrawAmount, account, web3, exchange, dispatch)
        }}>
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder="ETH Amount"
              onChange={(e) => {
                console.log('etherWithdrawAmountChanged', e.target.value)
                dispatch(etherWithdrawAmountChanged(e.target.value))}}
              className="form-control form-control-sm bg-light text-dark"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="Submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
          </div>
        </form>

        <table className="table table-light table-sm small">
          <tbody>
            <tr>
              <td>{token.symbol}</td>
              <td>{tokenBalance}</td>
              <td>{exchangeTokenBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className="row" onSubmit={(event) => {
          event.preventDefault()
          withdrawToken(tokenWithdrawAmount, account, web3, token, exchange, dispatch)
        }}>
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder={`${token.symbol} Amount`}
              onChange={(e) => {
                console.log('etherWithdrawAmountChanged', e.target.value)
                dispatch(tokenWithdrawAmountChanged(e.target.value))}}
              className="form-control form-control-sm bg-light text-dark"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="Submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
          </div>
        </form>

      </Tab>
    </Tabs>
  )
}

function mapStateToProps(state) {
  const balancesLoading = balancesLoadingSelector(state)
  const tokenLoading = tokenLoadingSelector(state)

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    etherBalance: etherBalanceSelector(state),
    tokenBalance: tokenBalanceSelector(state),
    exchangeEtherBalance: exchangeEtherBalanceSelector(state),
    exchangeTokenBalance: exchangeTokenBalanceSelector(state),
    balancesLoading,
    showForm: !tokenLoading && !balancesLoading,
    etherDepositAmount: etherDepositAmountSelector(state),
    etherWithdrawAmount: etherWithdrawAmountSelector(state),
    tokenDepositAmount: tokenDepositAmountSelector(state),
    tokenWithdrawAmount: tokenWithdrawAmountSelector(state)
  }
}

export default connect(mapStateToProps)(FundsBalance)


