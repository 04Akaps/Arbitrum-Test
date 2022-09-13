pragma solidity ^0.8.0;

contract SimpleStorageL1 {
    uint256 storedData = 100;
    address senderCheck;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    function setAddress() public {
        senderCheck = msg.sender;
    }

    function getAddress() public view returns (address) {
        return senderCheck;
    }
}
