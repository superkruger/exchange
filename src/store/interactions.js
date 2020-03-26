import Web3 from 'web3'
import Exchange from '../contracts/abis/Exchange.json'
import Token from '../contracts/abis/Token18.json'
import { 
	web3Loaded,
	web3AccountLoaded,
	exchangeLoaded,
	networkIdSet,
	tokenAdded,
	selectingToken,
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
import { ETHER_ADDRESS, tokensToWei, etherToWei } from '../helpers'

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
		subscribeToExchangeEvents(exchange, dispatch)

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

export const subscribeToExchangeEvents = async (exchange, dispatch) => {
	exchange.events.TokenAdded({}, (error, event) => {
		dispatch(tokenAdded(event.returnValues))
	})
}

export const subscribeToTokenEvents = async (tokenAddress, exchange, dispatch) => {
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

export const addToken = async (tokenAddress, tokens, web3, account, exchange, dispatch) => {
	try {
		// check if not already present
		const index = tokens.findIndex(token => token.tokenAddress === tokenAddress)
		if (index !== -1) {
			throw "allready present" 
		}

		const tokenContract = await new web3.eth.Contract(Token.abi, tokenAddress)

		// check if really ERC20
		checkContractFunction(tokenContract, 'name()') // optional, but we need it
		checkContractFunction(tokenContract, 'symbol()') // optional, but we need it
		checkContractFunction(tokenContract, 'decimals()') // optional, but we need it
		checkContractFunction(tokenContract, 'totalSupply()')
		checkContractFunction(tokenContract, 'balanceOf(address)')
		checkContractFunction(tokenContract, 'transfer(address,uint256)')
		checkContractFunction(tokenContract, 'transferFrom(address,address,uint256)')
		checkContractFunction(tokenContract, 'approve(address,uint256)')
		checkContractFunction(tokenContract, 'allowance(address,address)')

		const decimals = await tokenContract.methods.decimals().call()
		const name = await tokenContract.methods.name().call()
		const symbol = await tokenContract.methods.symbol().call()

		console.log("addToken", tokenAddress, tokenContract.options.address)

		exchange.methods.addToken(tokenAddress, name, symbol, decimals).send({from: account})
		.on('transactionHash', (hash) => {
			console.log('addded token with hash', hash)
		})
		.on('error', (error) => {
			console.log('Could not add token', error)
		})
	} catch (error) {
		console.log('Could not add new token:', error)
	}
}

const checkContractFunction = (contract, functionSignature) => {
	if (contract.methods[functionSignature] === undefined) {
		throw "Not an ERC20 token: " + functionSignature
	}
}

export const selectToken = async (tokenAddress, tokens, account, exchange, web3, dispatch) => {
	try {
		dispatch(selectingToken())

		const index = tokens.findIndex(token => token.tokenAddress === tokenAddress)
		let token = tokens[index]

		const tokenContract = await new web3.eth.Contract(Token.abi, token.tokenAddress)
		token.contract = tokenContract

		await loadBalances(account, exchange, token, web3, dispatch)
		await loadAllOrders(tokenAddress, exchange, dispatch)
		subscribeToTokenEvents(tokenAddress, exchange, dispatch)

		dispatch(tokenSelected(token))
	} catch (error) {
		console.log('Could not add new token', error)
	}
}

export const loadBalances = async (account, exchange, token, web3, dispatch) => {
	dispatch(balancesLoading())

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
	exchange.methods.depositEther().send({from: account, value: etherToWei(amount)})
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.log('Could not deposit ether', error)
		window.alert('Could not deposit ether')
	})
}

export const withdrawEther = (amount, account, web3, exchange, dispatch) => {
	exchange.methods.withdrawEther(etherToWei(amount)).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.log('Could not withdraw ether', error)
		window.alert('Could not withdraw ether')
	})
}

export const depositToken = (amount, account, web3, token, exchange, dispatch) => {
	amount = tokensToWei(amount, token.decimals)

	token.contract.methods.approve(exchange.options.address, amount).send({from: account})
	.on('transactionHash', (hash) => {
		exchange.methods.depositToken(token.contract.options.address, amount).send({from: account})
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
	exchange.methods.withdrawToken(token.contract.options.address, tokensToWei(amount, token.decimals)).send({from: account})
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
	const amountGet = tokensToWei(order.amount, token.decimals)
	const tokenGive = ETHER_ADDRESS
	const amountGive = etherToWei((order.amount * order.price).toString())

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
	const amountGet = etherToWei((order.amount * order.price).toString())
	const tokenGive = token.contract.options.address
	const amountGive = tokensToWei(order.amount, token.decimals)

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