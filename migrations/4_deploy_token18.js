const Token18 = artifacts.require("Token18");

module.exports = async function(deployer) {

	await deployer.deploy(Token18);

};
