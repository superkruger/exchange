pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Exchange {
	using SafeMath for uint;

	address public feeAccount;
	uint256 public feePercent;

	constructor (address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	// reverts if ether is sent directly to exchange
	function() external {
		revert();
	}
}