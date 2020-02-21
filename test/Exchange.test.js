const Exchange = artifacts.require('./Exchange')
const DummyToken = artifacts.require('./DummyToken')

import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from './helpers'

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
	let exchange
	let token
	const feePercent = 10

	beforeEach(async () => {
		// deploy token
		token = await DummyToken.new()
		// transfer tokens to user1
		token.transfer(user1, tokens(100), {from: deployer})
		// deploy exchange
		exchange = await Exchange.new(feeAccount, feePercent)
	})

	describe('deployment', () => {
		it('tracks the fee account', async () => {
			const result = await exchange.feeAccount()
			result.should.equal(feeAccount)
		})

		it('tracks the fee percent', async () => {
			const result = await exchange.feePercent()
			result.toString().should.equal(feePercent.toString())
		})
	})

	describe('fallback revert', () => {
		it('reverts when ether is sent directly to exchange', async () => {
			await exchange.sendTransaction({value: 1, from: user1}).should.be.rejectedWith(EVM_REVERT)
		})
	})

	describe('depositing ether', () => {

		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
		})

		describe('success', () => {

			beforeEach(async () => {
				result = await exchange.depositEther({from: user1, value: amount})
			})

			it('tracks ether deposit', async () => {
				let balance
				// check exchange ether balance
				balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.eq(amount.toString())
			})

			it('emits a Deposit event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Deposit')
				const event = log.args
				event.token.toString().should.eq(ETHER_ADDRESS, 'token is correct')
				event.user.toString().should.eq(user1, 'user is correct')
				event.amount.toString().should.eq(amount.toString(), 'amount is correct')
				event.balance.toString().should.eq(amount.toString(), 'balance is correct')
			})
		})
	})

	describe('withdrawing ether', () => {

		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
			await exchange.depositEther({from: user1, value: amount})
		})

		describe('success', () => {

			beforeEach(async () => {
				result = await exchange.withdrawEther(amount, {from: user1})
			})

			it('tracks ether withdrawal', async () => {
				let balance
				// check exchange ether balance
				balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.eq('0')
			})

			it('emits a Withdrawal event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Withdraw')
				const event = log.args
				event.token.toString().should.eq(ETHER_ADDRESS, 'token is correct')
				event.user.toString().should.eq(user1, 'user is correct')
				event.amount.toString().should.eq(amount.toString(), 'amount is correct')
				event.balance.toString().should.eq('0', 'balance is correct')
			})
		})

		describe('failure', () => {
			it('rejects withdraws for insufficient balances', async () => {
				let invalidAmount
				invalidAmount = ether(100) // greater than balance
				await exchange.withdrawEther(invalidAmount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('depositing tokens', () => {

		let result
		let amount

		beforeEach(async () => {
			amount = tokens(10)
		})

		describe('success', () => {

			beforeEach(async () => {
				await token.approve(exchange.address, amount, {from: user1})
				result = await exchange.depositToken(token.address, amount, {from: user1})
			})

			it('tracks token deposit', async () => {
				let balance
				// check exchange balance
				balance = await token.balanceOf(exchange.address)
				balance.toString().should.eq(amount.toString())
				// check token balance on exchange
				balance = await exchange.tokens(token.address, user1)
				balance.toString().should.eq(amount.toString())
			})

			it('emits a Deposit event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Deposit')
				const event = log.args
				event.token.toString().should.eq(token.address, 'token is correct')
				event.user.toString().should.eq(user1, 'user is correct')
				event.amount.toString().should.eq(amount.toString(), 'amount is correct')
				event.balance.toString().should.eq(amount.toString(), 'balance is correct')
			})
		})

		describe('failure', () => {
			it('rejects ether deposits', async () => {
				await exchange.depositToken(ETHER_ADDRESS, amount, {from: user1}).should.be.rejected
			})

			it('fails when no tokens are approved', async () => {
				await exchange.depositToken(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('withdrawing tokens', () => {

		let result
		let amount

		beforeEach(async () => {
			amount = tokens(10)
		})

		describe('success', () => {

			beforeEach(async () => {
				await token.approve(exchange.address, amount, {from: user1})
				await exchange.depositToken(token.address, amount, {from: user1})

				result = await exchange.withdrawToken(token.address, amount, {from: user1})
			})

			it('tracks token withdrawal', async () => {
				let balance
				// check exchange token balance
				balance = await exchange.tokens(token.address, user1)
				balance.toString().should.eq('0')
			})

			it('emits a Withdrawal event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Withdraw')
				const event = log.args
				event.token.toString().should.eq(token.address, 'token is correct')
				event.user.toString().should.eq(user1, 'user is correct')
				event.amount.toString().should.eq(amount.toString(), 'amount is correct')
				event.balance.toString().should.eq('0', 'balance is correct')
			})
		})

		describe('failure', () => {
			it('rejects ether withdrawals', async () => {
				await exchange.withdrawToken(ETHER_ADDRESS, amount, {from: user1}).should.be.rejected
			})

			it('rejects withdraws for insufficient balances', async () => {
				let invalidAmount
				invalidAmount = tokens(100) // greater than balance
				await exchange.withdrawToken(token.address, invalidAmount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})
})