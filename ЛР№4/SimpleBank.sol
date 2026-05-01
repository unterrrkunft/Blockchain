pragma solidity ^0.8.0;

contract SimpleBank {

    address public owner;

    mapping(address => uint256) public balances;
    mapping(address => bool) public registered;

    uint256 public totalBankBalance;

    address[] private userAddresses;

    struct UserBalance {
        address user;
        uint256 balance;
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier isRegistered() {
        require(registered[msg.sender] == true, "User not registered");
        _;
    }

    function register() public {
        if (!registered[msg.sender]) {
            registered[msg.sender] = true;
            userAddresses.push(msg.sender);
        }
    }

    function deposit() public payable isRegistered {
        require(msg.value > 0, "Send ETH to deposit");

        balances[msg.sender] += msg.value;
        totalBankBalance += msg.value;
    }

    function getMyBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function withdraw(uint256 _amount) public isRegistered {
        require(balances[msg.sender] >= _amount, "Not enough balance");

        balances[msg.sender] -= _amount;
        totalBankBalance -= _amount;

        payable(msg.sender).transfer(_amount);
    }

    function transfer(address _to, uint256 _amount) public isRegistered {
        require(registered[_to], "Receiver not registered");
        require(balances[msg.sender] >= _amount, "Not enough balance");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function getTotalBalance() public view onlyOwner returns (uint256) {
        return totalBankBalance;
    }

    function getAllUsersBalance() public view returns (UserBalance[] memory) {
        UserBalance[] memory result = new UserBalance[](userAddresses.length);

        for (uint256 i = 0; i < userAddresses.length; i++) {
            address user = userAddresses[i];

            result[i] = UserBalance({
                user: user,
                balance: balances[user]
            });
        }

        return result;
    }
}