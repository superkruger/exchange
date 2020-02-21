const Exchange = artifacts.require('./Exchange')
const Token = artifacts.require('./Token')

import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from './helpers'

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
	let exchange
	let token
	const feePercent = 10

	beforeEach(async () => {
		// deploy token
		token = await Token.new()
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

	describe('checking balances', () => {

		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
		})

		describe('success', () => {

			beforeEach(async () => {
				await exchange.depositEther({from: user1, value: amount})
				result = await exchange.balanceOf(ETHER_ADDRESS, user1)
			})

			it('tracks ether balance', async () => {
				// check exchange ether balance
				result.toString().should.eq(amount.toString())
			})
		})
	})

	describe('making orders', () => {

		let result
		let tokenAmount
		let etherAmount

		beforeEach(async () => {
			tokenAmount = tokens(1)
			etherAmount = ether(1)
		})

		describe('success', () => {

			beforeEach(async () => {
				result = await exchange.makeOrder(token.address, tokenAmount, ETHER_ADDRESS, etherAmount, {from: user1})
			})

			it('tracks the new order', async () => {
				const orderCount = await exchange.orderCount()
				orderCount.toString().should.eq('1')

				const order = await exchange.orders(orderCount.toString())
				order.id.toString().should.eq(orderCount.toString(), 'id is correct')
				order.user.should.eq(user1, 'user is correct')
				order.tokenGet.should.eq(token.address, 'tokenGet is correct')
				order.amountGet.toString().should.eq(tokenAmount.toString(), 'amountGet is correct')
				order.tokenGive.should.eq(ETHER_ADDRESS, 'tokenGive is correct')
				order.amountGive.toString().should.eq(etherAmount.toString(), 'amountGive is correct')
				order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
			})

			it('emits an Order event', async () => {
				const orderCount = await exchange.orderCount()

				const log = result.logs[0]
				log.event.should.eq('Order')
				const event = log.args
				event.id.toString().should.eq(orderCount.toString(), 'id is correct')
				event.user.should.eq(user1, 'user is correct')
				event.tokenGet.should.eq(token.address, 'tokenGet is correct')
				event.amountGet.toString().should.eq(tokenAmount.toString(), 'amountGet is correct')
				event.tokenGive.should.eq(ETHER_ADDRESS, 'tokenGive is correct')
				event.amountGive.toString().should.eq(etherAmount.toString(), 'amountGive is correct')
				event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
			})
		})
	})

	describe('order actions', () => {
		let tokenAmount
		let etherAmount

		beforeEach(async () => {
			tokenAmount = tokens(1)
			etherAmount = ether(1)

			await exchange.depositEther({from: user1, value: etherAmount})
			await token.transfer(user2, tokens(100), {from: deployer})
			await token.approve(exchange.address, tokens(2), {from: user2})
			await exchange.depositToken(token.address, tokens(2), {from: user2})
			await exchange.makeOrder(token.address, tokenAmount, ETHER_ADDRESS, etherAmount, {from: user1})
		})

		describe('cancelling orders', () => {

			let result

			describe('success', () => {

				beforeEach(async () => {
					result = await exchange.cancelOrder('1', {from: user1})
				})

				it('updates cancelled orders', async () => {
					const orderCancelled = await exchange.orderCancelled(1)
					orderCancelled.should.eq(true)
				})

				it('emits a Cancel event', async () => {
					
					const log = result.logs[0]
					log.event.should.eq('Cancel')
					const event = log.args
					event.id.toString().should.eq('1', 'id is correct')
					event.user.should.eq(user1, 'user is correct')
					event.tokenGet.should.eq(token.address, 'tokenGet is correct')
					event.amountGet.toString().should.eq(tokenAmount.toString(), 'amountGet is correct')
					event.tokenGive.should.eq(ETHER_ADDRESS, 'tokenGive is correct')
					event.amountGive.toString().should.eq(etherAmount.toString(), 'amountGive is correct')
					event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
				})
			})

			describe('failure', () => {
				it('rejects invalid order id', async () => {
					const invalidOrderId = 999
					await exchange.cancelOrder(invalidOrderId, {from: user1}).should.be.rejectedWith(EVM_REVERT)
				})

				it('rejects unauthorised cancellations', async () => {
					await exchange.cancelOrder('1', {from: user2}).should.be.rejectedWith(EVM_REVERT)
				})
			})
		})

		describe('filling orders', () => {

			let result

			describe('success', () => {

				beforeEach(async () => {
					result = await exchange.fillOrder('1', {from: user2})
				})

				it('executes trade and charges fees', async () => {
					let balance
					balance = await exchange.balanceOf(token.address, user1)
					balance.toString().should.eq(tokenAmount.toString(), 'user1 received tokens')
					balance = await exchange.balanceOf(ETHER_ADDRESS, user2)
					balance.toString().should.eq(etherAmount.toString(), 'user2 received ether')
					balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
					balance.toString().should.eq('0', 'user1 ether deducted')
					balance = await exchange.balanceOf(token.address, user2)
					balance.toString().should.eq(tokens(0.9).toString(), 'user2 token deducted with fee')
					const feeAccount = await exchange.feeAccount()
					balance = await exchange.balanceOf(token.address, feeAccount)
					balance.toString().should.eq(tokens(0.1).toString(), 'fee received')
				})

				it('updates filled orders', async () => {
					const orderFilled = await exchange.orderFilled(1)
					orderFilled.should.eq(true)
				})

				it('emits a Trade event', async () => {
					
					const log = result.logs[0]
					log.event.should.eq('Trade')
					const event = log.args
					event.id.toString().should.eq('1', 'id is correct')
					event.user.should.eq(user1, 'user is correct')
					event.tokenGet.should.eq(token.address, 'tokenGet is correct')
					event.amountGet.toString().should.eq(tokenAmount.toString(), 'amountGet is correct')
					event.tokenGive.should.eq(ETHER_ADDRESS, 'tokenGive is correct')
					event.amountGive.toString().should.eq(etherAmount.toString(), 'amountGive is correct')
					event.userFill.should.eq(user2, 'userFill is correct')
					event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
				})
			})

			describe('failure', () => {
				it('rejects invalid order id', async () => {
					const invalidOrderId = 999
					await exchange.cancelOrder(invalidOrderId, {from: user1}).should.be.rejectedWith(EVM_REVERT)
				})

				it('rejects unauthorised cancellations', async () => {
					await exchange.cancelOrder('1', {from: user2}).should.be.rejectedWith(EVM_REVERT)
				})
			})
		})
	})
})