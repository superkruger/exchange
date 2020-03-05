export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
export const DECIMALS = 18

export const GREEN = 'success'
export const RED = 'danger'

export const weiToEther = (wei) => {
	if (wei) {
		return (wei / (10 ** DECIMALS))
	}
}

export const weiToTokens = (wei, tokenDecimals) => {
	if (wei) {
		return (wei / (10 ** tokenDecimals))
	}
}

export const etherToWei = (e) => {
	if (e) {
		return (e * (10 ** DECIMALS)).toString()
	}
}

export const tokensToWei = (t, tokenDecimals) => {
	if (t) {
		return (t * (10 ** tokenDecimals)).toString()
	}
}

export const formatBalance = (balance) => {
	const precision = 100
	balance = weiToEther(balance)
	balance = Math.round(balance * precision) / precision
	return balance
}