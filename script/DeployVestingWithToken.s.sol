// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Token.sol";
import "../src/TokenVesting.sol";
import "forge-std/console.sol";

contract DeployVestingWithToken is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy Token first
        Token token = new Token("VestingToken", "VEST", 10_000_000 ether);
        console.log("Token deployed at:", address(token));

        // Deploy TokenVesting with the token address
        TokenVesting vesting = new TokenVesting(address(token));
        console.log("TokenVesting deployed at:", address(vesting));

        // Transfer some tokens to the vesting contract for testing
        token.transfer(address(vesting), 1_000_000 ether);
        console.log("Transferred 1,000,000 tokens to vesting contract");

        console.log("\n=== Deployment Summary ===");
        console.log("Token Address:", address(token));
        console.log("Vesting Address:", address(vesting));
        console.log("\nUpdate your .env files with:");
        console.log("VITE_CONTRACT_ADDRESS=", address(vesting));
        console.log("CONTRACT_ADDRESS=", address(vesting));

        vm.stopBroadcast();
    }
}











