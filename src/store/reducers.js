import { combineReducers } from 'redux'


function web3 (state = {}, action ) {
	switch (action.type) {
		case 'WEB3_LOADED':
			return { ...state, connection: action.connection }
		case 'WEB3_ACCOUNT_LOADED':
			return { ...state, account: action.account }
		case 'ETHER_BALANCE_LOADED':
			return { ...state, balance: action.balance}
		default:
			return state
	}
}

function exchange (state = {}, action ) {
	let index
	let data
	switch (action.type) {
		case 'EXCHANGE_LOADED':
			return { ...state, loaded: true, contract: action.contract, tokens: {data: []}, token: null }
		case 'TOKEN_ADDED':
			// prevent duplicates
			index = state.tokens.data.findIndex(token => token.tokenAddress === action.token.tokenAddress)
		
			if (index === -1) {
				data = [...state.tokens.data, action.token]
			} else {
				data = state.tokens.data
			}
			return { 
				...state,
				tokens: {
					...state.tokens,
					data
				}
			}
		case 'TOKEN_SELECTED':
			return { ...state, token: action.token }
		case 'TOKEN_BALANCE_LOADED':
			return { ...state, token: {... state.token, balance: action.balance}}
		case 'EXCHANGE_ETHER_BALANCE_LOADED':
			return { ...state, etherBalance: action.balance}
		case 'EXCHANGE_TOKEN_BALANCE_LOADED':
			return { ...state, tokenBalance: action.balance}
		case 'BALANCES_LOADING':
			return { ...state, balancesLoading: true} 
		case 'BALANCES_LOADED':
			return { ...state, balancesLoading: false} 
		case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
			return { ...state, etherDepositAmount: action.amount} 
		case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
			return { ...state, etherWithdrawAmount: action.amount} 
		case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
			return { ...state, tokenDepositAmount: action.amount} 
		case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
			return { ...state, tokenWithdrawAmount: action.amount}
		case 'BUY_ORDER_AMOUNT_CHANGED':
			return { ...state, buyOrder: {...state.buyOrder, amount: action.amount } } 
		case 'BUY_ORDER_PRICE_CHANGED':
			return { ...state, buyOrder: {...state.buyOrder, price: action.price } } 
		case 'BUY_ORDER_MAKING':
			return { ...state, buyOrder: {...state.buyOrder, amount: null, price: null, making: true } } 
		case 'SELL_ORDER_AMOUNT_CHANGED':
			return { ...state, sellOrder: {...state.sellOrder, amount: action.amount } } 
		case 'SELL_ORDER_PRICE_CHANGED':
			return { ...state, sellOrder: {...state.sellOrder, price: action.price } } 
		case 'SELL_ORDER_MAKING':
			return { ...state, sellOrder: {...state.sellOrder, amount: null, price: null, making: true } } 
		case 'ORDER_MADE':
			// prevent duplicates
			index = state.allOrders.data.findIndex(order => order.id === action.order.id)
		
			if (index === -1) {
				data = [...state.allOrders.data, action.order]
			} else {
				data = state.allOrders.data
			}
			return { 
				...state, 
				buyOrder: {
					...state.buyOrder,
					making: false
				},
				sellOrder: {
					...state.sellOrder,
					making: false
				},
				allOrders: {
					...state.allOrders,
					data
				}} 
		case 'CANCELLED_ORDERS_LOADED':
			return { ...state, cancelledOrders: {loaded: true, data: action.cancelledOrders }}
		case 'FILLED_ORDERS_LOADED':
			return { ...state, filledOrders: {loaded: true, data: action.filledOrders }} 
		case 'ALL_ORDERS_LOADED':
			return { ...state, allOrders: {loaded: true, data: action.allOrders }} 
		case 'ORDER_CANCELLING':
			return { ...state, orderCancelling: true} 
		case 'ORDER_CANCELLED':
			return { 
				...state, 
				orderCancelling: false,
				cancelledOrders: {
					...state.cancelledOrders,
					data: [
						...state.cancelledOrders.data,
						action.order
					]
				}} 
		case 'ORDER_FILLING':
			return { ...state, orderFilling: true} 
		case 'ORDER_FILLED':
			// prevent duplicates
			index = state.filledOrders.data.findIndex(order => order.id === action.order.id)
			if (index === -1) {
				data = [...state.filledOrders.data, action.order]
			} else {
				data = state.filledOrders.data
			}
			return { 
				...state, 
				orderFilling: false,
				filledOrders: {
					...state.filledOrders,
					data
				}} 
		default:
			return state
	}
}

const rootReducer = combineReducers({
	web3,
	exchange
})

export default rootReducer