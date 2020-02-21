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
	mapping(uint256 => _Order) public orders;
	uint256 public orderCount;
	mapping(uint256 => bool) public orderCancelled;
	mapping(uint256 => bool) public orderFilled;

	struct _Order {
		uint256 id;
		address user;
		address tokenGet;
		uint256 amountGet;
		address tokenGive;
		uint256 amountGive;
		uint256 timestamp;
	}
	
	event ERC20Added(address indexed erc20);
	event ERC20Removed(address indexed erc20);
	event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);
	event Withdraw(address indexed token, address indexed user, uint256 amount, uint256 balance);
	event Order(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
	event Cancel(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
	event Trade(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, address userFill, uint256 timestamp);
	
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

	function makeOrder(
		address _tokenGet,
		uint256 _amountGet,
		address _tokenGive,
		uint256 _amountGive) public {

		orderCount = orderCount.add(1);
		uint256 _timestamp = now;
		

		orders[orderCount] = _Order(
			orderCount, 
			msg.sender, 
			_tokenGet, 
			_amountGet, 
			_tokenGive, 
			_amountGive,
			_timestamp);

		emit Order(
			orderCount, 
			msg.sender, 
			_tokenGet, 
			_amountGet, 
			_tokenGive, 
			_amountGive,
			_timestamp);
	}

	function cancelOrder(uint256 _id) public {

		_Order storage _order = orders[_id];
		require(address(_order.user) == msg.sender);

		orderCancelled[_id] = true;

		emit Cancel(
			_order.id, 
			_order.user, 
			_order.tokenGet, 
			_order.amountGet, 
			_order.tokenGive, 
			_order.amountGive,
			now);
	}

	function fillOrder(uint256 _id) public {
		require(_id > 0 && _id <= orderCount);
		require(!orderCancelled[_id]);
		require(!orderFilled[_id]);

		_Order storage _order = orders[_id];
		_trade(_order);
		orderFilled[_id] = true;
	}

	function _trade(_Order storage _order) internal {
		uint256 _feeAmount = _order.amountGet.mul(feePercent).div(100);

		tokens[_order.tokenGet][msg.sender] = tokens[_order.tokenGet][msg.sender].sub(_order.amountGet.add(_feeAmount));
		tokens[_order.tokenGet][_order.user] = tokens[_order.tokenGet][_order.user].add(_order.amountGet);
		tokens[_order.tokenGet][feeAccount] = tokens[_order.tokenGet][feeAccount].add(_feeAmount);
		tokens[_order.tokenGive][_order.user] = tokens[_order.tokenGive][_order.user].sub(_order.amountGive);
		tokens[_order.tokenGive][msg.sender] = tokens[_order.tokenGive][msg.sender].add(_order.amountGive);

		emit Trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, msg.sender, now);
	}
}