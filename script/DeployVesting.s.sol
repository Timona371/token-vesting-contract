// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/TokenVesting.sol";
import "forge-std/Script.sol";
import "forge-std/console.sol";

contract DeployVesting is Script {
    function run() external {
        vm.startBroadcast();

        // ✅ Use your actual ERC20 token address here (NOT the vesting contract)

        address tokenAddress = 0x2EaD95872afd7281dAf0bC86A650F0C04EE459AD;

        TokenVesting vesting = new TokenVesting(tokenAddress);

        console.log("TokenVesting deployed at:", address(vesting));

        vm.stopBroadcast();
    }
}
