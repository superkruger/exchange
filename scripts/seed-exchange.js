// Contracts
const Token18 = artifacts.require("Token18")
const Token9 = artifacts.require("Token9")
const Exchange = artifacts.require("Exchange")

// Utils
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000' // Ether token deposit address

const ether = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

const tokens18 = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

const tokens9 = (n) => {
  let val = new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'gwei')
  )

  console.log(`tokens9 from ${n} to ${val}`)

  return val
}

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const seed = async (accounts, token, tokensFunction, exchange) => {
    // Give tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = 10000 // 10,000 tokens

    await token.transfer(receiver, tokensFunction(amount), { from: sender })
    console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`)

    // Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]

    // User 1 Deposits Ether
    amount = 1
    await exchange.depositEther({ from: user1, value: ether(amount) })
    console.log(`Deposited ${amount} Ether from ${user1}`)

    // User 2 Approves Tokens
    amount = 10000
    await token.approve(exchange.address, tokensFunction(amount), { from: user2 })
    console.log(`Approved ${amount} tokens from ${user2}`)

    // User 2 Deposits Tokens
    await exchange.depositToken(token.address, tokensFunction(amount), { from: user2 })
    console.log(`Deposited ${amount} tokens from ${user2}`)

    /////////////////////////////////////////////////////////////
    // Seed a Cancelled Order
    //

    // User 1 makes order to get tokens
    let result
    let orderId
    result = await exchange.makeOrder(token.address, tokensFunction(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
    console.log(`Made order from ${user1}`)

    // User 1 cancells order
    orderId = result.logs[0].args.id
    await exchange.cancelOrder(orderId, { from: user1 })
    console.log(`Cancelled order from ${user1}`)

    /////////////////////////////////////////////////////////////
    // Seed Filled Orders
    //

    // User 1 makes order
    result = await exchange.makeOrder(token.address, tokensFunction(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
    console.log(`Made order from ${user1}`)

    // User 2 fills order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log(`Filled order from ${user1}`)

    // Wait 1 second
    await wait(1)

    // User 1 makes another order
    result = await exchange.makeOrder(token.address, tokensFunction(50), ETHER_ADDRESS, ether(0.01), { from: user1 })
    console.log(`Made order from ${user1}`)

    // User 2 fills another order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log(`Filled order from ${user1}`)

    // Wait 1 second
    await wait(1)

    // User 1 makes final order
    result = await exchange.makeOrder(token.address, tokensFunction(200), ETHER_ADDRESS, ether(0.15), { from: user1 })
    console.log(`Made order from ${user1}`)

    // User 2 fills final order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log(`Filled order from ${user1}`)

    // Wait 1 second
    await wait(1)

    /////////////////////////////////////////////////////////////
    // Seed Open Orders
    //

    // User 1 makes 10 BUY orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(token.address, tokensFunction(10 * i), ETHER_ADDRESS, ether(0.01), { from: user1 })
      console.log(`Made order from ${user1}`)
      // Wait 1 second
      await wait(1)
    }

    // User 2 makes 10 SELL orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.02), token.address, tokensFunction(10 * i), { from: user2 })
      console.log(`Made order from ${user2}`)
      // Wait 1 second
      await wait(1)
    }
}

module.exports = async function(callback) {
  try {
    // Fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts()

    // Fetch the deployed tokens
    const token18 = await Token18.deployed()
    console.log('Token18 fetched', token18.address)
    const token9 = await Token9.deployed()
    console.log('Token9 fetched', token9.address)

    // Fetch the deployed exchange
    const exchange = await Exchange.deployed()
    console.log('Exchange fetched', exchange.address)

    await seed(accounts, token18, tokens18, exchange)
    await seed(accounts, token9, tokens9, exchange)

  }
  catch(error) {
    console.log(error)
  }

  callback()
}

