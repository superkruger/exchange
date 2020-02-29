import { get } from 'lodash'
import { createSelector } from 'reselect'

const account = (state) => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const web3 = state => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, w => w)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

export const contractsLoadedSelector = createSelector(
	exchangeLoaded,
	(el) => (el)
)

const newTokenAddress = state => get(state, 'exchange.newTokenAddress', {})
export const newTokenAddressSelector = createSelector(newTokenAddress, n => n)

const tokens = state => get(state, 'exchange.tokens.data', [])
export const tokensSelector = createSelector(tokens, t => t)

