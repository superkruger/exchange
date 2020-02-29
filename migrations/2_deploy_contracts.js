const Exchange = artifacts.require("Exchange");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
	const accounts = await web3.eth.getAccounts();
	const feeAccount = accounts[0];
	const feePercent = 1;

	await deployer.deploy(Token);
  	await deployer.deploy(Exchange, feeAccount, feePercent);

};
