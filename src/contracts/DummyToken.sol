pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract DummyToken {
	using SafeMath for uint;

	// variables
	string public name = "Dummy Token";
	string public symbol = "DTKN";
	uint256 public decimals = 18;
	uint256 public totalSupply;

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;

	// events
	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);

	constructor() public {
		totalSupply = 1000000 * (10 ** decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	function _transfer(address _from, address _to, uint256 _value) internal returns (bool success) {
		require(_to != address(0));
		require(_value <= balanceOf[_from]);

		balanceOf[_from] = balanceOf[_from].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(_from, _to, _value);
		return true;
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		return _transfer(msg.sender, _to, _value);
	}

	function approve(address _spender, uint256 _value) public returns (bool success) {
		require(_spender != address(0));

		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}
	
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		require(allowance[_from][msg.sender] >= _value);
		require(balanceOf[_from] >= _value);

		allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
		return _transfer(_from, _to, _value);
	}
}