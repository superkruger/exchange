import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Spinner from './Spinner'
import DepthChart from './DepthChart'
import { 
  orderBookSelector,
  orderBookLoadedSelector,
  exchangeSelector,
  accountSelector,
  orderFillingSelector,
  depthChartSelector 
} from '../store/selectors'
import { fillOrder } from '../store/interactions'

class OrderBook extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          OrderBook
        </div>
        <div className="card-body">
          <Tabs defaultActiveKey="chart" className="bg-light text-dark">
                <Tab eventKey="chart" title="Depth Chart" className="bg-light">
                    { this.props.orderBookLoaded ? showDepthChart(this.props.depthChart) : <Spinner type='div'/> }
                </Tab>
                <Tab eventKey="buys" title="Buys" className="bg-light">
                  <table className="table table-light table-sm small">
                    { this.props.orderBookLoaded ? showOrderBook(this.props, true) : <Spinner type='table'/> }
                  </table>
                </Tab>
                <Tab eventKey="sells" title="Sells" className="bg-light">
                  <table className="table table-light table-sm small">
                    { this.props.orderBookLoaded ? showOrderBook(this.props, false) : <Spinner type='table'/> }
                  </table>
                </Tab>
              </Tabs>
        </div>
      </div>
    )
  }
}

function showOrderBook(props, buys) {
  const { orderBook } = props
  const orders = (buys ? orderBook.buyOrders : orderBook.sellOrders)

  return (
    <tbody>
      <tr>
        <th>DAPP</th>
        <th>ETH/DAPP</th>
        <th>ETH</th>
      </tr>
      { orders.map((order) => renderOrder(order, props)) }
    </tbody>
  )
}

function renderOrder(order, props) {
  const { account, exchange, dispatch } = props

  return (
    <OverlayTrigger
      key={order.id}
      placement='auto'
      overlay={
        <Tooltip id={order.id}>
          {`Click here to ${order.orderFillAction}`}
        </Tooltip>
      }
    >
      <tr key={order.id}
          className="order-book-order"
          onClick={(e) => {
            fillOrder(order, account, exchange, dispatch)
          }}
      >
        <td>{order.tokenAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
      </tr>
    </OverlayTrigger>
  )
}

function showDepthChart(depthChart) {
    console.log("DepthChart", depthChart.orders)
    return (
      <DepthChart data={depthChart.orders} priceTitle="ETH/DAPP" volumeTitle="DAPP" />
    )
}

function mapStateToProps(state) {
  const orderBookLoaded = orderBookLoadedSelector(state)
  const orderFilling = orderFillingSelector(state)

  return {
    orderBookLoaded: orderBookLoaded && !orderFilling,
    orderBook: orderBookSelector(state),
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    depthChart: depthChartSelector(state)
  }
}

export default connect(mapStateToProps)(OrderBook)


