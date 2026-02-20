# Quick Deployment Guide

## Problem
The contract at `0x3d222890f47Aabe7f39a94248DF56AFc36D5d1Ae` is not deployed. This address is either:
- An empty account (EOA)
- A contract that was never deployed
- A contract on a different network

## Solution: Deploy the Contract

### Option 1: Deploy Everything (Recommended for First Time)

This script deploys both the token and vesting contract:

```bash
# Make sure Anvil is running in another terminal
anvil

# In this terminal, deploy everything
forge script script/DeployVestingWithToken.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast
```

After deployment, you'll see output like:
```
Token deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
TokenVesting deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### Option 1b: Deploy to Sepolia (Public Testnet)

This deploys both the token and vesting contract to Sepolia using Foundry.

Set environment variables:

```bash
export SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
export PRIVATE_KEY="0xYOUR_DEPLOYER_PRIVATE_KEY"
```

Deploy:

```bash
forge script script/DeployVestingWithToken.s.sol \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast
```

Copy the printed addresses:
- `Token deployed at: ...`
- `TokenVesting deployed at: ...` (this is the address the dashboard uses)

### Option 2: Deploy Separately

```bash
# Step 1: Deploy Token
forge script script/DeployToken.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast

# Step 2: Update DeployVesting.s.sol with the token address
# Edit script/DeployVesting.s.sol and set tokenAddress

# Step 3: Deploy Vesting
forge script script/DeployVesting.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast
```

### Update Environment Variables

After deployment, update both `.env` files:

**Frontend `.env` (in `frontend/` directory):**
```env
VITE_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_RPC_URL=http://localhost:8545
VITE_BACKEND_URL=http://localhost:5000
```

**Backend `.env` (in `backend/` directory):**
```env
CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
RPC_URL=http://localhost:8545
PRIVATE_KEY=your_private_key_here
PORT=5000
```

For Sepolia, set these instead:

**Frontend `.env` (in `frontend/` directory):**
```env
VITE_CONTRACT_ADDRESS=0xYOUR_SEPOLIA_VESTING_ADDRESS
VITE_RPC_URL=$SEPOLIA_RPC_URL
VITE_BACKEND_URL=http://localhost:5000
```

**Backend `.env` (in `backend/` directory):**
```env
CONTRACT_ADDRESS=0xYOUR_SEPOLIA_VESTING_ADDRESS
RPC_URL=$SEPOLIA_RPC_URL
PORT=5000
```

### Restart Services

After updating `.env` files:

```bash
# Restart backend
cd backend && npm start

# Restart frontend (in new terminal)
cd frontend && npm run dev
```

### Verify Deployment

Check if contract is deployed:
```bash
cast code YOUR_CONTRACT_ADDRESS --rpc-url http://localhost:8545
```

If it returns `0x`, the contract is not deployed. If it returns a long hex string, it's deployed!

## Troubleshooting

- **"Connection refused"**: Make sure Anvil is running
- **"Insufficient funds"**: Use Anvil's default accounts (they have plenty of ETH)
- **"Contract not found"**: Verify the address is correct in `.env` files











