// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Token.sol";

contract DeployToken is Script {
    function run() external {
        vm.startBroadcast();
        Token token = new Token("MyToken", "MTK", 1_000_000 ether);
        console.log("Token deployed to:", address(token));
        vm.stopBroadcast();
    }
}

