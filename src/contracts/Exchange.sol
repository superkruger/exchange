pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange {
	using SafeMath for uint;

	address public feeAccount;
	uint256 public feePercent;
	address constant ETHER = address(0); // allows storage of ether in blank address in token mapping

	// mapping(uint256 => address) public erc20s;
	// uint256 public erc20Count;
	mapping(address => mapping(address => uint256)) public tokens;

	event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);
	event Withdraw(address indexed token, address indexed user, uint256 amount, uint256 balance);
	event ERC20Added(address indexed erc20);
	event ERC20Removed(address indexed erc20);
	
	constructor (address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	// reverts if ether is sent directly to exchange
	function() external {
		revert();
	}

	function addERC20(address _erc20) public {
		// erc20Count = erc20Count.add(1);
		// erc20s[erc20Count] = _erc20;

		emit ERC20Added(_erc20);//, erc20Count);
	}

	function removeERC20(address _erc20) public {
		// erc20Count = erc20Count.add(1);
		// erc20s[erc20Count] = _erc20;

		emit ERC20Removed(_erc20);//, erc20Count);
	}

	function depositEther() payable public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function withdrawEther(uint256 _amount) public {
		require(tokens[ETHER][msg.sender] >= _amount);
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
		msg.sender.transfer(_amount);
		emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
	}

	function depositToken(address _token, uint256 _amount) public {
		require(_token != ETHER);
		require(ERC20(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function withdrawToken(address _token, uint256 _amount) public {
		require(_token != ETHER);
		require(tokens[_token][msg.sender] >= _amount);
		tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
		emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf(address _token, address _user) public view returns (uint256) {
		return tokens[_token][_user];
	}
}