import { combineReducers } from 'redux'


function web3 (state = {}, action ) {
	switch (action.type) {
		case 'WEB3_LOADED':
			return { ...state, connection: action.connection }
		case 'WEB3_ACCOUNT_LOADED':
			return { ...state, account: action.account }
		default:
			return state
	}
}

function exchange (state = {}, action ) {
	switch (action.type) {
		case 'EXCHANGE_LOADED':
			return { ...state, loaded: true, contract: action.contract, tokens: {data: []} }
		case 'TOKEN_ADDRESS_CHANGED':
			return { ...state, newTokenAddress: action.address } 
		case 'TOKEN_ADDED':
			// prevent duplicates
			let index = state.tokens.data.findIndex(token => token.tokenAddress === action.token.tokenAddress)
			let data
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
		default:
			return state
	}
}

const rootReducer = combineReducers({
	web3,
	exchange
})

export default rootReducer