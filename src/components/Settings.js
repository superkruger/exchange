import React, { Component } from 'react'
import { Form, FormControl, Button, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { 
  addToken
} from '../store/interactions'
import { 
  accountSelector, 
  exchangeSelector,
  web3Selector,
  tokenListSelector
} from '../store/selectors'

class Settings extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    const {
      web3,
      exchange,
      account,
      tokenList,
      dispatch
    } = this.props

    return (
      <div>
        <div className="card bg-light text-dark">
          <div className="card-header">
            Add new ERC20 Token
          </div>
          <div className="card-body">
              <Form noValidate onSubmit={(event) => {
                event.preventDefault()
                let tokenAddressInput = document.getElementById('newTokenAddressInput')
                addToken(tokenAddressInput.value, tokenList, web3, account, exchange, dispatch)
              }}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Control autoFocus name="tokenAddress" placeholder="Token contract address" id="newTokenAddressInput" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Button variant="primary" type="submit">
                    Add Token
                  </Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </div>
        </div>
        
        <div className="card bg-light text-dark">
          <div className="card-header">
            ERC20 Tokens
          </div>
          <div className="card-body">
              { showTokens(this.props) }
          </div>
        </div>
      </div>
    )
  }
}

function showTokens(props) {
  const { tokenList } = props
  return (
    <table className="table table-bordered table-light table-sm small" id="dataTable" width="100%">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Decimals</th>
        </tr>
      </thead>
      <tbody>
      { tokenList.map((token) => {
          return (
              <tr key={token.tokenAddress}>
                <td className="text-muted">{token.symbol}</td>
                <td>{token.name}</td>
                <td>{token.decimals}</td>
              </tr>
          )
        })
      }
      </tbody>
    </table>
  )
}

function mapStateToProps(state) {

  return {
    account: accountSelector(state),
    web3: web3Selector(state),
    exchange: exchangeSelector(state),
    tokenList: tokenListSelector(state)
  }
}

export default connect(mapStateToProps)(Settings)


