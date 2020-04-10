import React, { Component } from 'react'
import { connect } from 'react-redux'
import toast from 'toasted-notes' 
import 'toasted-notes/src/styles.css'
import Notification from '../Notification'
import Spinner from '../Spinner'
import { 
  depositToken,
  withdrawToken 
} from '../../store/interactions'
import {
  accountSelector, 
  exchangeSelector, 
  tokenSelector, 
  web3Selector,
  balancesLoadingSelector,
  tokenBalanceSelector,
  exchangeTokenBalanceSelector,
  tokenDepositAmountSelector,
  tokenWithdrawAmountSelector
} from '../../store/selectors'
import { 
  tokenDepositAmountChanged,
  tokenWithdrawAmountChanged
} from '../../store/actions'

class ETHFunds extends Component {
	componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
  }

  render() {
    return (
      <div>
      {
        this.props.showForm ? 
          <div className="card bg-light text-dark">
            <div className="card-header">
              { this.props.token.symbol }
            </div>
            <div className="card-body">
              { showForm(this.props) }
            </div>
          </div>
        : <Spinner type="div" />
      }
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
    tokenBalance,
    exchangeTokenBalance,
    dispatch,
    tokenDepositAmount,
    tokenWithdrawAmount
  } = props
  return(
    <table className="table table-light table-sm small">
      
      <tbody>
        <tr>
          <td>{tokenBalance}</td>
          <td>{exchangeTokenBalance}</td>
        </tr>
        <tr>
          <td>
            <form onSubmit={(event) => {
              event.preventDefault()
              depositToken(tokenDepositAmount, account, web3, token, exchange, dispatch, (success) => {
                if (!success) {
                  toast.notify(() => <Notification title={`Could not deposit ${token.symbol}`} type="danger" />)
                }
              })
            }}>
              <div className="row">
                <div className="col-12 col-sm pr-sm-2">
                  <input
                    type="text"
                    placeholder={`${token.symbol} Amount`}
                    onChange={(e) => {dispatch(tokenDepositAmountChanged(e.target.value))}}
                    className="form-control form-control-sm bg-light text-dark"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm pr-sm-2">
                  <button type="Submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                </div>
              </div>
            </form>
          </td>
          <td>
            <form onSubmit={(event) => {
              event.preventDefault()
              withdrawToken(tokenWithdrawAmount, account, web3, token, exchange, dispatch, (success) => {
                if (!success) {
                  toast.notify(() => <Notification title={`Could not withdraw ${token.symbol}`} type="danger" />)
                }
              })
            }}>
              <div className="row">
                <div className="col-12 col-sm pr-sm-2">
                  <input
                    type="text"
                    placeholder={`${token.symbol} Amount`}
                    onChange={(e) => {
                      dispatch(tokenWithdrawAmountChanged(e.target.value))}}
                    className="form-control form-control-sm bg-light text-dark"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm pr-sm-0">
                  <button type="Submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                </div>
              </div>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function mapStateToProps(state) {
  const balancesLoading = balancesLoadingSelector(state)
  const token = tokenSelector(state)

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: token,
    web3: web3Selector(state),
    tokenBalance: tokenBalanceSelector(state),
    exchangeTokenBalance: exchangeTokenBalanceSelector(state),
    balancesLoading,
    showForm: token && !balancesLoading,
    tokenDepositAmount: tokenDepositAmountSelector(state),
    tokenWithdrawAmount: tokenWithdrawAmountSelector(state)
  }
}

export default connect(mapStateToProps)(ETHFunds)


