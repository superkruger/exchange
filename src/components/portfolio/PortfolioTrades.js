import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { 
  myFilledOrdersSelector,
  myFilledOrdersLoadedSelector,
  exchangeSelector,
  accountSelector,
  tokenSelector,
  tokenLoadingSelector,
  orderCancellingSelector
} from '../../store/selectors'
import { cancelOrder } from '../../store/interactions'

class PortfolioTrades extends Component {

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-body">
            { this.props.myFilledOrdersLoaded ? showMyFilledOrders(this.props) : <Spinner type="div" /> }
        </div>
      </div>
    )
  }
}

function showMyFilledOrders(props) {
  const { myFilledOrders, token } = props
  return (
    <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%">
      <thead>
        <tr>
          <th>Time</th>
          <th>{token.symbol}</th>
          <th>ETH/{token.symbol}</th>
        </tr>
      </thead>
      <tbody>
      { myFilledOrders.map((order) => {
          return (
              <tr key={order.id}>
                <td className="text-muted">{order.formattedTimestamp}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.orderSign}{order.tokenAmount}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
              </tr>
          )
        })
      }
      </tbody>
    </table>
  )
}

function mapStateToProps(state) {
  const orderCancelling = orderCancellingSelector(state)
  const tokenLoading = tokenLoadingSelector(state)

  return {
    myFilledOrdersLoaded: !tokenLoading && myFilledOrdersLoadedSelector(state),
    myFilledOrders: myFilledOrdersSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: tokenSelector(state)
  }
}

export default connect(mapStateToProps)(PortfolioTrades)


