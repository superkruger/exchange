import Web3 from 'web3'
import Exchange from '../contracts/abis/Exchange.json'
import { 
	web3Loaded,
	web3AccountLoaded,
	exchangeLoaded
} from './actions.js'
import { ETHER_ADDRESS } from '../helpers'

export const loadWeb3 = (dispatch) => {
	const web3 = new Web3(window['ethereum'] || Web3.givenProvider || 'http://127.0.0.1:7545');
	dispatch(web3Loaded(web3))
	return web3
}

export const loadAccount = async (web3, dispatch) => {
	const accounts = await web3.eth.getAccounts()
	const account = accounts[0]
	dispatch(web3AccountLoaded(account))
	return account
}

export const loadExchange = async (web3, networkId, dispatch) => {
	try {
		const exchange = await new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
		dispatch(exchangeLoaded(exchange))
		return exchange
	} catch (error) {
		console.log('Contract not deployed to the current network', error)
		return null
	}
}
