import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { 
  myOpenOrdersSelector,
  myOpenOrdersLoadedSelector,
  exchangeSelector,
  accountSelector,
  tokenSelector,
  tokenLoadingSelector,
  orderCancellingSelector
} from '../../store/selectors'
import { cancelOrder } from '../../store/interactions'

class PortfolioOrders extends Component {

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-body">
          
            { this.props.myOpenOrdersLoaded ? showMyOpenOrders(this.props) : <Spinner type="div" /> }
          
        </div>
      </div>
    )
  }
}

function showMyOpenOrders(props) {
  const { myOpenOrders, dispatch, exchange, account, token } = props
  return (
    <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%" cellspacing="0">
      <thead>
        <tr>
          <th>Amount</th>
          <th>ETH/{token.symbol}</th>
          <th>Cancel</th>
        </tr>
      </thead>
      <tbody>
      { myOpenOrders.map((order) => {
          return (
              <tr key={order.id}>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td 
                className="text-muted cancel-order"
                onClick={(e) => {
                  cancelOrder(order, account, exchange, dispatch)
                }}>x</td>
              </tr>
          )
        })
      }
      </tbody>
    </table>
  )
}

function mapStateToProps(state) {
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state)
  const orderCancelling = orderCancellingSelector(state)
  const tokenLoading = tokenLoadingSelector(state)

  return {
    myOpenOrdersLoaded: !tokenLoading && myOpenOrdersLoaded && !orderCancelling,
    myOpenOrders: myOpenOrdersSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: tokenSelector(state)
  }
}

export default connect(mapStateToProps)(PortfolioOrders)


