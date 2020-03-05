import Web3 from 'web3'
import Exchange from '../contracts/abis/Exchange.json'
import Token from '../contracts/abis/Token.json'
import { 
	web3Loaded,
	web3AccountLoaded,
	exchangeLoaded,
	networkIdSet,
	tokenAdded,
	tokenSelected,
	etherBalanceLoaded,
	tokenBalanceLoaded,
	exchangeEtherBalanceLoaded,
	exchangeTokenBalanceLoaded,
	balancesLoading,
	balancesLoaded,
	buyOrderMaking,
	sellOrderMaking,
	orderMade,
	cancelledOrdersLoaded,
	filledOrdersLoaded,
	allOrdersLoaded,
	orderCancelling,
	orderCancelled,
	orderFilling,
	orderFilled
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

export const subscribeToEvents = async (tokenAddress, exchange, dispatch) => {
	exchange.events.TokenAdded({}, (error, event) => {
		dispatch(tokenAdded(event.returnValues))
	})
	exchange.events.Cancel({filter: {tokenGet: [tokenAddress, ETHER_ADDRESS], tokenGive: [tokenAddress, ETHER_ADDRESS]}}, (error, event) => {
		dispatch(orderCancelled(event.returnValues))
	})
	exchange.events.Trade({filter: {tokenGet: [tokenAddress, ETHER_ADDRESS], tokenGive: [tokenAddress, ETHER_ADDRESS]}}, (error, event) => {
		dispatch(orderFilled(event.returnValues))
	})
	exchange.events.Deposit({filter: {token: [tokenAddress, ETHER_ADDRESS]}}, (error, event) => {
		dispatch(balancesLoaded())
	})
	exchange.events.Withdraw({filter: {token: [tokenAddress, ETHER_ADDRESS]}}, (error, event) => {
		dispatch(balancesLoaded())
	})
	exchange.events.Order({filter: {tokenGet: [tokenAddress, ETHER_ADDRESS], tokenGive: [tokenAddress, ETHER_ADDRESS]}}, (error, event) => {
		dispatch(orderMade(event.returnValues))
	})
}

export const loadAllOrders = async (tokenAddress, exchange, dispatch) => {
	try {
		const cancelStream = await exchange.getPastEvents(
			'Cancel', 
			{
				filter: {tokenGet: [tokenAddress, ETHER_ADDRESS], tokenGive: [tokenAddress, ETHER_ADDRESS]},
				fromBlock: 0
			}
		)
		const cancelledOrders = cancelStream.map((event) => event.returnValues)
		dispatch(cancelledOrdersLoaded(cancelledOrders))

		const tradeStream = await exchange.getPastEvents(
			'Trade', 
			{
				filter: {tokenGet: [tokenAddress, ETHER_ADDRESS], tokenGive: [tokenAddress, ETHER_ADDRESS]},
				fromBlock: 0
			}
		)
		const filledOrders = tradeStream.map((event) => event.returnValues)
		dispatch(filledOrdersLoaded(filledOrders))

		const orderStream = await exchange.getPastEvents(
			'Order', 
			{
				filter: {tokenGet: [tokenAddress, ETHER_ADDRESS], tokenGive: [tokenAddress, ETHER_ADDRESS]},
				fromBlock: 0
			}
		)
		const allOrders = orderStream.map((event) => event.returnValues)
		dispatch(allOrdersLoaded(allOrders))
	} catch (error) {
		console.log('Could not get order streams')
		return null
	}
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

export const selectToken = async (tokenAddress, tokens, account, exchange, web3, dispatch) => {
	try {
		console.log(tokens)
		const index = tokens.findIndex(token => token.tokenAddress === tokenAddress)
		let token = tokens[index]
		const tokenContract = await new web3.eth.Contract(Token.abi, token.tokenAddress)
		token.contract = tokenContract

		loadBalances(account, exchange, token, web3, dispatch)
		loadAllOrders(tokenAddress, exchange, dispatch)
		subscribeToEvents(tokenAddress, exchange, dispatch)

		dispatch(tokenSelected(token))
	} catch (error) {
		console.log('Could not add new token', error)
	}
}

export const loadBalances = async (account, exchange, token, web3, dispatch) => {
	
	const etherBalance = await web3.eth.getBalance(account)
	dispatch(etherBalanceLoaded(etherBalance))

	const tokenBalance = await token.contract.methods.balanceOf(account).call()
	dispatch(tokenBalanceLoaded(tokenBalance))

	const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
	dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))

	const exchangeTokenBalance = await exchange.methods.balanceOf(token.contract.options.address, account).call()
	dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

	dispatch(balancesLoaded())
}

export const depositEther = (amount, account, web3, exchange, dispatch) => {
	exchange.methods.depositEther.send({from: account, value: web3.utils.toWei(amount, 'ether')})
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.log('Could not deposit ether', error)
		window.alert('Could not deposit ether')
	})
}

export const withdrawEther = (amount, account, web3, exchange, dispatch) => {
	exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.log('Could not withdraw ether', error)
		window.alert('Could not withdraw ether')
	})
}

export const depositToken = (amount, account, web3, token, exchange, dispatch) => {
	amount = web3.utils.toWei(amount, 'ether')

	token.methods.approve(exchange.options.address, amount).send({from: account})
	.on('transactionHash', (hash) => {
		exchange.methods.depositToken(token.options.address, amount).send({from: account})
		.on('transactionHash', (hash) => {
			dispatch(balancesLoading())
		})
	})
	.on('error', (error) => {
		console.log('Could not approve token deposit', error)
		window.alert('Could not approve token deposit')
	})
}

export const withdrawToken = (amount, account, web3, token, exchange, dispatch) => {
	exchange.methods.withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether')).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.log('Could not withdraw token', error)
		window.alert('Could not withdraw token')
	})
}

export const makeBuyOrder = (order, account, web3, token, exchange, dispatch) => {
	const tokenGet = token.contract.options.address
	const amountGet = web3.utils.toWei(order.amount, 'ether')
	const tokenGive = ETHER_ADDRESS
	const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether')

	exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(buyOrderMaking())
	})
	.on('error', (error) => {
		console.log('Could not make buy order', error)
		window.alert('Could not make buy order')
	})
}

export const makeSellOrder = (order, account, web3, token, exchange, dispatch) => {
	const tokenGet = ETHER_ADDRESS
	const amountGet = web3.utils.toWei((order.amount * order.price).toString(), 'ether')
	const tokenGive = token.contract.options.address
	const amountGive = web3.utils.toWei(order.amount, 'ether')

	exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(sellOrderMaking())
	})
	.on('error', (error) => {
		console.log('Could not make sell order', error)
		window.alert('Could not make sell order')
	})
}

export const cancelOrder = (order, account, exchange, dispatch) => {
	exchange.methods.cancelOrder(order.id).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(orderCancelling())
	})
	.on('error', (error) => {
		console.log('Could not cancel order', error)
		window.alert('Could not cancel order')
	})
}

export const fillOrder = (order, account, exchange, dispatch) => {
	exchange.methods.fillOrder(order.id).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(orderFilling())
	})
	.on('error', (error) => {
		console.log('Could not fill order', error)
		window.alert('Could not fill order')
	})
}