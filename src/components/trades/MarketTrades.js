import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import Spinner from '../Spinner'
import {
  contractsLoadedSelector,
  tokenSelector,
  tokenLoadingSelector,
  filledOrdersLoadedSelector,
  filledOrdersSelector 
} from '../../store/selectors'

class MarketTrades extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    return (
      <div>
        { this.props.contractsLoaded ?
            <div className="card bg-light text-dark">
              <div className="card-header">
                Market Trades
              </div>
              <div className="card-body">
                <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>{this.props.token.symbol}</th>
                        <th>ETH/{this.props.token.symbol}</th>
                      </tr>
                    </thead>
                    { this.props.filledOrdersLoaded ? showFilledOrders(this.props.filledOrders) : <Spinner type="table" /> }
                  </table>
              </div>
            </div>
          :
          <Spinner type="div" />
        }
      </div>
    )
  }
}

function showFilledOrders(orders) {
  return (
    <tbody>
    { orders.map((order) => {
        return (
            <tr key={order.id} className={`order-${order.id}`}>
              <td className="text-muted">{order.formattedTimestamp}</td>
              <td>{order.tokenAmount}</td>
              <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
            </tr>
        )
      })
    }
    </tbody>
  )
}

function mapStateToProps(state) {
  const tokenLoading = tokenLoadingSelector(state)
  const filledOrdersLoaded = filledOrdersLoadedSelector(state)

  return {
    contractsLoaded: contractsLoadedSelector(state),
    token: tokenSelector(state),
    filledOrdersLoaded: filledOrdersLoaded && !tokenLoading,
    filledOrders: filledOrdersSelector(state)
  }
}

export default connect(mapStateToProps)(MarketTrades)


