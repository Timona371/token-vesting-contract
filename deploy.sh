#!/bin/bash

# Quick deployment script for Token Vesting Contract
# Make sure Anvil is running before executing this script

echo "🚀 Deploying Token Vesting Contract..."
echo ""

# Check if Anvil is running
if ! curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "❌ Error: Anvil is not running on http://localhost:8545"
    echo "Please start Anvil first: anvil"
    exit 1
fi

echo "✅ Anvil is running"
echo ""

# Deploy both token and vesting contract
echo "📦 Deploying Token and Vesting Contract..."
echo "Using Anvil's default account #0..."
forge script script/DeployVestingWithToken.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the 'TokenVesting deployed at:' address from above"
echo "2. Update frontend/.env with: VITE_CONTRACT_ADDRESS=<deployed_address>"
echo "3. Update backend/.env with: CONTRACT_ADDRESS=<deployed_address>"
echo "4. Restart frontend and backend"
echo ""



