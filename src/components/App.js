import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import Navbar from './Navbar'
import Content from './Content'
import { 
  loadWeb3, 
  loadAccount,
  loadExchange 
} from '../store/interactions'

import { contractsLoadedSelector } from '../store/selectors'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
      const web3 = loadWeb3(dispatch)
      await window.ethereum.enable();

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
  render() {
    return (
      <div>
        <Navbar/>
        { this.props.contractsLoaded ? <Content/> : <div className="content"/>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App);
