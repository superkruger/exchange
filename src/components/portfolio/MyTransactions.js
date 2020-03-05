import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { 
  myFilledOrdersSelector,
  myFilledOrdersLoadedSelector,
  myOpenOrdersSelector,
  myOpenOrdersLoadedSelector,
  exchangeSelector,
  accountSelector,
  orderCancellingSelector
} from '../../store/selectors'
import { cancelOrder } from '../../store/interactions'

class MyTransactions extends Component {

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          MyTransactions
        </div>
        <div className="card-body">
          <Tabs defaultActiveKey="trades" className="bg-light text-dark">
            <Tab eventKey="trades" title="Trades" className="bg-light">
              <table className="table table-light table-sm small">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>DAPP</th>
                    <th>ETH/DAPP</th>
                  </tr>
                </thead>
                { this.props.myFilledOrdersLoaded ? showMyFilledOrders(this.props) : <Spinner type="table" /> }
              </table>
            </Tab>
            <Tab eventKey="orders" title="Orders" className="bg-light">
              <table className="table table-light table-sm small">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>ETH/DAPP</th>
                    <th>Cancel</th>
                  </tr>
                </thead>
                { this.props.myOpenOrdersLoaded ? showMyOpenOrders(this.props) : <Spinner type="table" /> }
              </table>
            </Tab>
          </Tabs>
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
    myFilledOrdersLoaded: myFilledOrdersLoadedSelector(state),
    myFilledOrders: myFilledOrdersSelector(state),
    myOpenOrdersLoaded: myOpenOrdersLoaded && !orderCancelling,
    myOpenOrders: myOpenOrdersSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state)
  }
}

export default connect(mapStateToProps)(MyTransactions)


