import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import Spinner from '../Spinner'
import PriceChart from './PriceChart'
import { 
  filledOrdersLoadedSelector,
  filledOrdersSelector 
} from '../../store/selectors'

class Trades extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    return (
      <Container>
        <Row>
          <Col sm={12}>
            <PriceChart />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div className="card bg-light text-dark">
              <div className="card-body">
                <table className="table table-light table-sm small">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>DAPP</th>
                        <th>ETH/DAPP</th>
                      </tr>
                    </thead>
                    { this.props.filledOrdersLoaded ? showFilledOrders(this.props.filledOrders) : <Spinner type="table" /> }
                  </table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      
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
  return {
    filledOrdersLoaded: filledOrdersLoadedSelector(state),
    filledOrders: filledOrdersSelector(state)
  }
}

export default connect(mapStateToProps)(Trades)


