pragma solidity ^0.8.0;

import "../interfaces/ArbSys.sol";

contract SimpleStorageL2 {
    ArbSys constant arbSys = ArbSys(0x0000000000000000000000000000000000000064);

    uint256 storedData = 100;
    address simpleStorageL1;

    constructor(address _address) {
        simpleStorageL1 = _address;
    }

    // function set(uint256 x) public {
    //     require(x < 50000);
    //     storedData = x;
    // }

    // function get() public view returns (uint256) {
    //     return storedData;
    // }

    function sendTxToL1() external payable returns (uint256) {
        bytes memory data = abi.encodeWithSignature("set(uint256)", storedData);
        return arbSys.sendTxToL1(simpleStorageL1, data);
    }

    function sendTxToL1CheckAddress() external payable returns (uint256) {
        bytes memory data = abi.encodeWithSignature("setAddress()");
        return arbSys.sendTxToL1(simpleStorageL1, data);
    }
}
