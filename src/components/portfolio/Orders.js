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
  orderCancellingSelector
} from '../../store/selectors'
import { cancelOrder } from '../../store/interactions'

class Orders extends Component {

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-body">
          <table className="table table-light table-sm small">
            <thead>
              <tr>
                <th>Amount</th>
                <th>ETH/{this.props.token.symbol}</th>
                <th>Cancel</th>
              </tr>
            </thead>
            { this.props.myOpenOrdersLoaded ? showMyOpenOrders(this.props) : <Spinner type="table" /> }
          </table>
        </div>
      </div>
    )
  }
}

function showMyOpenOrders(props) {
  const { myOpenOrders, dispatch, exchange, account } = props
  return (
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
  )
}

function mapStateToProps(state) {
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state)
  const orderCancelling = orderCancellingSelector(state)
  return {
    myOpenOrdersLoaded: myOpenOrdersLoaded && !orderCancelling,
    myOpenOrders: myOpenOrdersSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: tokenSelector(state)
  }
}

export default connect(mapStateToProps)(Orders)


