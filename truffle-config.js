require('@babel/register');
require('@babel/polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKeys = process.env.PRIVATE_KEYS || ""
const infuraAPIKey = process.env.INFURA_API_KEY || ""

module.exports = {


  networks: {
    
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
            privateKeys.split(','),
            `https://kovan.infura.io/v3/${infuraAPIKey}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
            privateKeys.split(','),
            `https://ropsten.infura.io/v3/${infuraAPIKey}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 3,
      networkCheckTimeout: 6000000
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
            privateKeys.split(','),
            `https://rinkeby.infura.io/v3/${infuraAPIKey}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 4,
      networkCheckTimeout: 6000000
    }
  },

  contracts_directory: './src/contracts',
  contracts_build_directory: './src/contracts/abis',
  
  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
      }
    }
  }
}
