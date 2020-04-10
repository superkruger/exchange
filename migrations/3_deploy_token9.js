const Token9 = artifacts.require("Token9");

module.exports = async function(deployer) {

	await deployer.deploy(Token9);

};
