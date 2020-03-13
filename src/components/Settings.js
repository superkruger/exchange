import React, { Component } from 'react'
import { Form, FormControl, Button } from 'react-bootstrap'
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
        <Form noValidate onSubmit={(event) => {
            event.preventDefault()
            let tokenAddressInput = document.getElementById('newTokenAddressInput')
            addToken(tokenAddressInput.value, tokenList, web3, account, exchange, dispatch)
          }}>
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            name="tokenAddress"
            placeholder="token address"
            id="newTokenAddressInput"
          />
          <Button variant="primary" type="submit">
            Add Token
          </Button>
        </Form>
      </div>
    )
  }
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


