import React, { Component } from 'react'
import { connect } from 'react-redux'
import toast from 'toasted-notes' 
import 'toasted-notes/src/styles.css'
import Notification from '../Notification'
import Spinner from '../Spinner'
import { 
  depositEther,
  withdrawEther
} from '../../store/interactions'
import {
  accountSelector, 
  exchangeSelector, 
  tokenSelector, 
  web3Selector,
  balancesLoadingSelector,
  etherBalanceSelector,
  exchangeEtherBalanceSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector
} from '../../store/selectors'
import { 
  etherDepositAmountChanged,
  etherWithdrawAmountChanged
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
              ETH
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
    account,
    etherBalance,
    exchangeEtherBalance,
    dispatch,
    etherDepositAmount,
    etherWithdrawAmount
  } = props

  return(
    <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%">
      <thead>
        <tr>
          <th>Wallet</th>
          <th>Exchange</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{etherBalance}</td>
          <td>{exchangeEtherBalance}</td>
        </tr>
        <tr>
          <td>
            <form onSubmit={(event) => {
              event.preventDefault()
              depositEther(etherDepositAmount, account, web3, exchange, dispatch, (success) => {
                if (!success) {
                  toast.notify(() => <Notification title="Could not deposit ETH" type="danger" />)
                }
              })
            }}>
              <div className="row">
                <div className="col-12 col-sm pr-sm-2">
                  <input
                    type="text"
                    placeholder="ETH Amount"
                    onChange={(e) => {dispatch(etherDepositAmountChanged(e.target.value))}}
                    className="form-control form-control-sm bg-light text-dark"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm pr-sm-2">
                  <button type="Submit" id="deposit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                </div>
              </div>
            </form>
          </td>
          <td>
            <form onSubmit={(event) => {
              event.preventDefault()
              
              withdrawEther(etherWithdrawAmount, account, web3, exchange, dispatch, (success) => {
                if (!success) {
                  toast.notify(() => <Notification title="Could not withdraw ETH" type="danger" />)
                }
              })
            }}>
              <div className="row">
                <div className="col-12 col-sm pr-sm-2">
                  <input
                    type="text"
                    placeholder="ETH Amount"
                    onChange={(e) => {
                      dispatch(etherWithdrawAmountChanged(e.target.value))}}
                    className="form-control form-control-sm bg-light text-dark"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm pr-sm-2">
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
    etherBalance: etherBalanceSelector(state),
    exchangeEtherBalance: exchangeEtherBalanceSelector(state),
    balancesLoading,
    showForm: token && !balancesLoading,
    etherDepositAmount: etherDepositAmountSelector(state),
    etherWithdrawAmount: etherWithdrawAmountSelector(state)
  }
}

export default connect(mapStateToProps)(ETHFunds)


