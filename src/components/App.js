import React, { Component } from 'react'
import { connect } from 'react-redux'
import TopNav from './TopNav'
import SideNav from './SideNav'
import Routes from "./Routes"
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

  componentDidMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
      const web3 = loadWeb3(dispatch)
      await window.ethereum.enable();

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
        window.alert('Exchange smart contract not detected on current network');
        return;
      }
  }

  static getDerivedStateFromProps(props, state) {
    console.log("props", props)
    const {
      token,
      tokenList,
      account,
      exchange,
      web3,
      dispatch
    } = props

    if (token === null && tokenList.length > 0) {
      selectToken(tokenList[0].tokenAddress, tokenList, account, exchange, web3, dispatch)
    }

    return state
  }

  render() {

    if (!this.props.exchange) {
      return (
        <h3>Waiting to be connected to the {process.env.NETWORK_NAME} network</h3>
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
                <Routes />
              </div>
            </main>
          </div>
        </div>
        
      </div>
    );
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
