import { get, reject, groupBy, minBy, maxBy } from 'lodash'
import { createSelector } from 'reselect'
import moment from 'moment'
import { ETHER_ADDRESS, GREEN, RED, formatEtherBalance, formatTokenBalance, weiToEther, weiToTokens } from '../helpers'

const sideNavShow = (state) => get(state, 'app.sideNavShow', true)
export const sideNavShowSelector = createSelector(sideNavShow, s => s)

const account = (state) => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const web3 = state => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, w => w)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

const tokenList = state => get(state, 'exchange.tokens.data', [])
export const tokenListSelector = createSelector(tokenList, t => t)

const token = state => get(state, 'exchange.token', null)
export const tokenSelector = createSelector(token, t => t)

const tokenLoading = state => get(state, 'exchange.tokenLoading', true)
export const tokenLoadingSelector = createSelector(tokenLoading, t => t)

export const contractsLoadedSelector = createSelector(
	exchangeLoaded,
	token,
	(el, t) => (el && t !== null)
)

const balancesLoading = state => get(state, 'exchange.balancesLoading', true)
export const balancesLoadingSelector = createSelector(balancesLoading, l => l)

const etherBalance = state => get(state, 'web3.balance')
export const etherBalanceSelector = createSelector(
	etherBalance, 
	(balance) => {
		return formatEtherBalance(balance)
	})

const tokenBalance = state => get(state, 'exchange.tokenBalance')
export const tokenBalanceSelector = createSelector(
	tokenBalance, 
	token,
	(balance, token) => {
		if (!token || !balance) {
			return null
		}
		return formatTokenBalance(balance, token.decimals)
	})

const exchangeEtherBalance = state => get(state, 'exchange.exchangeEtherBalance')
export const exchangeEtherBalanceSelector = createSelector(
	exchangeEtherBalance, 
	(balance) => {
		return formatEtherBalance(balance)
	})

const exchangeTokenBalance = state => get(state, 'exchange.exchangeTokenBalance')
export const exchangeTokenBalanceSelector = createSelector(
	exchangeTokenBalance,
	token, 
	(balance, token) => {
		if (!token || !balance) {
			return null
		}
		return formatTokenBalance(balance, token.decimals)
	})

const etherDepositAmount = state => get(state, 'exchange.etherDepositAmount', null)
export const etherDepositAmountSelector = createSelector(etherDepositAmount, a => a)

const etherWithdrawAmount = state => get(state, 'exchange.etherWithdrawAmount', null)
export const etherWithdrawAmountSelector = createSelector(etherWithdrawAmount, a => a)

const tokenDepositAmount = state => get(state, 'exchange.tokenDepositAmount', null)
export const tokenDepositAmountSelector = createSelector(tokenDepositAmount, a => a)

const tokenWithdrawAmount = state => get(state, 'exchange.tokenWithdrawAmount', null)
export const tokenWithdrawAmountSelector = createSelector(tokenWithdrawAmount, a => a)

const buyOrder = state => get(state, 'exchange.buyOrder', {})
export const buyOrderSelector = createSelector(buyOrder, o => o)

const sellOrder = state => get(state, 'exchange.sellOrder', {})
export const sellOrderSelector = createSelector(sellOrder, o => o)

// Cancelled orders
const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, col => col)

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(
	cancelledOrders,
	(orders) => {
		console.log(orders)
	}
)

// Filled orders
const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, fol => fol)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
	filledOrders,
	token,
	(orders, token) => {
		// sort ascending for price comparison
		orders = orders.sort((a, b) => a.timestamp - b.timestamp)
		orders = decorateFilledOrders(orders, token)

		// sort descending for display
		orders = orders.sort((a, b) => b.timestamp - a.timestamp)
		return orders
	}
)

const decorateFilledOrders = (orders, token) => {
	let previousOrder = orders[0]
	return orders.map((order) => {
		order = decorateOrder(order, token)
		order = decorateFilledOrder(order, previousOrder)
		previousOrder = order
		return order
	})
}

const decorateOrder = (order, token) => {

	let etherAmount
	let tokenAmount

	if (order.tokenGive === ETHER_ADDRESS) {
		etherAmount = order.amountGive
		tokenAmount = order.amountGet
	} else {
		etherAmount = order.amountGet
		tokenAmount = order.amountGive
	}

	etherAmount = weiToEther(etherAmount)
	tokenAmount = weiToTokens(tokenAmount, token ? token.decimals : 18)

	const precision = 100000
	let tokenPrice = (etherAmount / tokenAmount)
	tokenPrice = Math.round(tokenPrice * precision) / precision

	return ({
		...order,
		etherAmount: etherAmount,
		tokenAmount: tokenAmount,
		tokenPrice,
		formattedTimestamp: moment.unix(order.timestamp).format('hh:mm:ss D/M/Y')
	})
}

const decorateFilledOrder = (order, previousOrder) => {
	return ({
		...order,
		tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
	})
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
	// show green if order price higher than previous
	// or if its the first order
	if (orderId === previousOrder.id) {
		return GREEN
	}
	if (previousOrder.tokenPrice <= tokenPrice) {
		return GREEN
	} else {
		return RED
	}
}

// All orders
const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false)

const allOrders = state => get(state, 'exchange.allOrders.data', [])

const openOrders = state => {
	const all = allOrders(state)
	const filled = filledOrders(state)
	const cancelled = cancelledOrders(state)

	const openOrders = reject(all, (order) => {
		const orderFilled = filled.some((o) => o.id === order.id)
		const orderCancelled = cancelled.some((o) => o.id === order.id)
		return (orderFilled || orderCancelled)
	})
	return openOrders
}

const orderBookLoaded = state => allOrdersLoaded(state) && filledOrdersLoaded(state) && cancelledOrdersLoaded(state)
export const orderBookLoadedSelector = createSelector(orderBookLoaded, obl => obl)

export const orderBookSelector = createSelector(
	openOrders,
	token,
	(orders, token) => {
		orders = decorateOrderBookOrders(orders, token)
		// group by order type
		orders = groupBy(orders, 'orderType')

		// sort each group
		const buyOrders = get(orders, 'buy', [])
		orders = {
			...orders,
			buyOrders: buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
		}

		const sellOrders = get(orders, 'sell', [])
		orders = {
			...orders,
			sellOrders: sellOrders.sort((a,b) => a.tokenPrice - b.tokenPrice)
		}
		return orders
	}
)

const decorateOrderBookOrders = (orders, token) => {
	return orders.map((order) => {
		order = decorateOrder(order, token)
		order = decorateOrderBookOrder(order)
		return order
	})
}

const decorateOrderBookOrder = (order) => {
	const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
	return ({
		...order,
		orderType,
		orderTypeClass: (orderType === 'buy' ? GREEN : RED),
		orderFillAction: (orderType === 'buy' ? 'sell to' : 'buy from')
	})
}

export const depthChartSelector = createSelector(
	openOrders,
	token,
	(orders, token) => {
		orders = decorateOrderBookOrders(orders, token)
		// group by order type
		orders = groupBy(orders, 'orderType')

		// buys are sorted descending
		const buyOrders = decorateWithVolume('bid', get(orders, 'buy', []).sort((a,b) => b.tokenPrice - a.tokenPrice))
		// sells are sorted ascending
		const sellOrders = decorateWithVolume('ask', get(orders, 'sell', []).sort((a,b) => a.tokenPrice - b.tokenPrice))

		orders = {
			orders: buyOrders
				.concat(sellOrders)
				.sort((a,b) =>  a.value - b.value)
		}

		return orders
	}
)

const decorateWithVolume = (type, orders) => {
	let res = []
	let prevPrice

	for(var i = 0; i < orders.length; i++) {
		orders[i].volume = orders[i].tokenAmount;
        
        if (i === 0) {
        	orders[i].totalvolume = orders[i].tokenAmount;
        }
        else {
        	if (prevPrice === orders[i].tokenPrice) {
        		orders[i].volume = orders[i-1].volume + orders[i].tokenAmount
        	}
          	orders[i].totalvolume = orders[i-1].totalvolume + orders[i].tokenAmount;
        }

        // aggregate orders with the same price
        if (prevPrice !== orders[i].tokenPrice) {
        	let dp = {};
	        dp["value"] = orders[i].tokenPrice;
	        dp[type + "volume"] = orders[i].volume;
	        dp[type + "totalvolume"] = orders[i].totalvolume;

        	res.push(dp);
    	} else {
    		res[res.length - 1][type + "volume"] = orders[i].volume;
    		res[res.length - 1][type + "totalvolume"] = orders[i].totalvolume;
    	}

        prevPrice = orders[i].tokenPrice
     }

     return res
}

export const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, fol => fol)

export const myFilledOrdersSelector = createSelector(
	account,
	filledOrders,
	token,
	(account, orders, token) => {
		orders = orders.filter((o) => o.user === account || o.userFill === account)
		orders = decorateMyFilledOrders(orders, account, token)
		return orders
	}
)

const decorateMyFilledOrders = (orders, account, token) => {
	return (
		orders.map((order) => {
			order = decorateOrder(order, token)
			order = decorateMyFilledOrder(order, account)
			return order
		})
	)
}

const decorateMyFilledOrder = (order, account) => {
	const myOrder = order.user === account

	let orderType
	if (myOrder) {
		orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
	} else {
		orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
	}

	return ({
		...order,
		orderTypeClass: (orderType === 'buy' ? GREEN : RED),
		orderSign: (orderType === 'buy' ? '+' : '-')
	})
}

export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, obl => obl)

export const myOpenOrdersSelector = createSelector(
	account,
	openOrders,
	token,
	(account, orders, token) => {
		orders = orders.filter((o) => o.user === account)
		orders = decorateMyOpenOrders(orders, account, token)
		orders = orders.sort((a, b) => b.timestamp - a.timestamp)
		return orders
	}
)

const decorateMyOpenOrders = (orders, account, token) => {
	return (
		orders.map((order) => {
			order = decorateOrder(order, token)
			order = decorateMyOpenOrder(order, account)
			return order
		})
	)
}

const decorateMyOpenOrder = (order, account) => {
	let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

	return ({
		...order,
		orderTypeClass: (orderType === 'buy' ? GREEN : RED)
	})
}

export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

export const priceChartSelector = createSelector(
	filledOrders,
	token,
	(orders, token) => {
		orders = orders.sort((a, b) => a.timestamp - b.timestamp)
		orders = orders.map((o) => decorateOrder(o, token))

		// get last two orders for final price
		let secondLastOrder, lastOrder
		[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
		const lastPrice = get(lastOrder, 'tokenPrice', 0)
		const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)
		return ({
			lastPrice,
			lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
			series: [{
				data: buildGraphData(orders)
			}]
		})
	}
)

export const buildGraphData = (orders) => {

	// group by hour
	orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())

	// get each hour with data
	const hours = Object.keys(orders)

	const graphData = hours.map((hour) => {
		// calculate open, high, low, close for the hour
		const group = orders[hour]
		const open = group[0]
		const close = group[group.length - 1]
		const low = minBy(group, 'tokenPrice')
		const high = maxBy(group, 'tokenPrice')

		return ({
			x: new Date(hour),
			y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
		})
	})

	return graphData
}

const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(orderCancelling, c => c)

const orderFilling = state => get(state, 'exchange.orderFilling', false)
export const orderFillingSelector = createSelector(orderFilling, f => f)
