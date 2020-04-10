import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'react-bootstrap'
import toast from 'toasted-notes' 
import 'toasted-notes/src/styles.css'
import Notification from './Notification'
import TopNav from './TopNav'
import SideNav from './SideNav'
import Content from "./Content"
import { 
  loadWeb3, 
  loadAccount,
  loadExchange,
  selectToken
} from '../store/interactions'
import { 
  accountSelector, 
  exchangeSelector,
  web3Selector,
  contractsLoadedSelector, 
  sideNavShowSelector, 
  tokenSelector, 
  tokenListSelector
} from '../store/selectors'
import { web3AccountLoaded } from '../store/actions'

class App extends Component {
  state = {};

  static getDerivedStateFromProps(props, state) {
    const {
      token,
      tokenList,
      account,
      exchange,
      web3,
      dispatch
    } = props

    if (token === null && tokenList.length > 0) {
      selectToken(tokenList[0].tokenAddress, tokenList, account, exchange, web3, dispatch, (success) => {
        if (!success) {
          toast.notify(() => <Notification title="Could not select token" type="danger" />)
        }
      })
    }

    return state
  }

  render() {

    if (!this.props.exchange) {
      return (
        <Container>
          <Row>
            <Col sm={12}>
              <div className="card bg-light text-dark">
                <div className="card-header">
                  Welcome to the Kouga ERC20 DEX
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              { (typeof window.ethereum !== 'undefined') ?
                  <div className="card bg-light text-dark">
                    <div className="card-header">
                      Please connect with Metamask
                      Then select either Ropsten or Rinkeby network
                    </div>
                    <div className="card-body">
                      <LoadingButton props={this.props}/>
                    </div>
                  </div>
                :
                  <div className="card bg-light text-dark">
                    <div className="card-header">
                      Please install <a href="http://metamask.io" target="_blank" rel="noopener noreferrer">Metamask</a>
                    </div>
                  </div>
                }
            </Col>
          </Row>
        </Container>
      )
    }

    return (
      <div className={`sb-nav-fixed ${this.props.sideNavShow ? "" : "sb-sidenav-toggled"}`}>

        <TopNav/>

        <div id="layoutSidenav">
          <SideNav/>
          <div id="layoutSidenav_content">
            <main>
              <div className="container-fluid">
                <Content />
              </div>
            </main>
          </div>
        </div>
        
      </div>
    );
  }
}

function LoadingButton(props) {

  const handleClick = () => connectMetamask(props.props);

  return (
    <Button
      variant="primary"
      onClick={handleClick}
    >
      Connect Metamask
    </Button>
  );
}

const connectMetamask = async (props) => {
  const { dispatch } = props

  await window.ethereum.enable()

  try {
    const web3 = loadWeb3(dispatch)

    window.ethereum.on('accountsChanged', function (accounts) {
      dispatch(web3AccountLoaded(accounts[0]))
    })

    window.ethereum.on('chainChanged', () => {
      document.location.reload()
    })

    // Acccounts now exposed
    const account = await loadAccount(web3, dispatch)
    console.log('account', account)

    const network = await web3.eth.net.getNetworkType()
    console.log('network', network)
    const networkId = await web3.eth.net.getId()
    console.log('network id', networkId)

    const exchange = await loadExchange(web3, networkId, dispatch)
    if (!exchange) {
      return;
    }
  } catch(e) {
    console.log(e)
    return;
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    web3: web3Selector(state),
    exchange: exchangeSelector(state),
    contractsLoaded: contractsLoadedSelector(state),
    sideNavShow: sideNavShowSelector(state),
    token: tokenSelector(state),
    tokenList: tokenListSelector(state)
  }
}

export default connect(mapStateToProps)(App);
