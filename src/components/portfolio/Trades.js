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
  orderCancellingSelector
} from '../../store/selectors'
import { cancelOrder } from '../../store/interactions'

class Trades extends Component {

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-body">
          
          <table className="table table-light table-sm small">
            <thead>
              <tr>
                <th>Time</th>
                <th>{this.props.token.symbol}</th>
                <th>ETH/{this.props.token.symbol}</th>
              </tr>
            </thead>
            { this.props.myFilledOrdersLoaded ? showMyFilledOrders(this.props) : <Spinner type="table" /> }
          </table>
            
        </div>
      </div>
    )
  }
}

function showMyFilledOrders(props) {
  const { myFilledOrders } = props
  return (
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
  )
}

function mapStateToProps(state) {
  const orderCancelling = orderCancellingSelector(state)
  return {
    myFilledOrdersLoaded: myFilledOrdersLoadedSelector(state),
    myFilledOrders: myFilledOrdersSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: tokenSelector(state)
  }
}

export default connect(mapStateToProps)(Trades)


