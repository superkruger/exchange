const Exchange = artifacts.require("Exchange");
const Token18 = artifacts.require("Token18");
const Token9 = artifacts.require("Token9");

module.exports = async function(deployer) {
	const accounts = await web3.eth.getAccounts();
	const feeAccount = accounts[0];
	const feePercent = 1;

	await deployer.deploy(Token18);
	await deployer.deploy(Token9);
  	await deployer.deploy(Exchange, feeAccount, feePercent);

};
