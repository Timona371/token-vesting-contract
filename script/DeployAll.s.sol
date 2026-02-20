// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Token.sol";
import "../src/MockTokenVesting.sol";

contract DeployAll is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy Token
        Token token = new Token("MyToken", "MTK", 1_000_000 ether);
        console.log( "Token deployed at:", address(token));

        // Deploy MockTokenVesting
        MockTokenVesting vesting = new MockTokenVesting(address(token));
        console.log("MockTokenVesting deployed at:", address(vesting));

        vm.stopBroadcast();
    }
}
