import Web3 from 'web3'
import Exchange from '../contracts/abis/Exchange.json'
import Token from '../contracts/abis/Token.json'
import { 
	web3Loaded,
	web3AccountLoaded,
	exchangeLoaded,
	networkIdSet,
	tokenAdded
} from './actions.js'
import { stringify } from 'json-stringify-safe';
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

		await loadAllTokens(exchange, dispatch)
		subscribeToEvents(exchange, dispatch)
		return exchange
	} catch (error) {
		console.log('Contract not deployed to the current network', error)
		return null
	}
}

export const loadAllTokens = async (exchange, dispatch) => {
	try {
		const tokenStream = await exchange.getPastEvents('TokenAdded', {fromBlock: 0})
		const tokens = tokenStream.map((event) => dispatch(tokenAdded(event.returnValues)))
	} catch (error) {
		console.log('Could not get token stream')
		return null
	}
}

export const subscribeToEvents = async (exchange, dispatch) => {
	exchange.events.TokenAdded({}, (error, event) => {
		dispatch(tokenAdded(event.returnValues))
	})
}

export const addToken = async (tokenAddress, web3, account, exchange, dispatch) => {
	try {
		const tokenContract = await new web3.eth.Contract(Token.abi, tokenAddress)
		const decimals = await tokenContract.methods.decimals().call()
		const name = await tokenContract.methods.name().call()
		const symbol = await tokenContract.methods.symbol().call()

		console.log(`adding token at ${tokenContract.options.address}: ${name}, ${symbol}, ${decimals}`)
		exchange.methods.addToken(tokenContract.options.address, name, symbol, decimals).send({from: account})
	} catch (error) {
		console.log('Could not add new token', error)
	}
}
