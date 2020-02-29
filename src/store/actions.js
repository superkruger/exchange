export function web3Loaded(connection) {
	return {
		type: 'WEB3_LOADED',
		connection
	}
}

export function web3AccountLoaded(account) {
	return {
		type: 'WEB3_ACCOUNT_LOADED',
		account
	}
}

export function exchangeLoaded(contract) {
	return {
		type: 'EXCHANGE_LOADED',
		contract
	}
}

export function tokenAddressChanged(address) {
	return {
		type: 'TOKEN_ADDRESS_CHANGED',
		address
	}
}

export function tokenAdded(token) {
	return {
		type: 'TOKEN_ADDED',
		token
	}
}