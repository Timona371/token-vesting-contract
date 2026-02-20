# 🚀 Step-by-Step Contract Deployment Guide

## Prerequisites

1. **Anvil must be running** (local blockchain)
2. **Foundry must be installed** (forge command)

## Step 1: Start Anvil

Open a **new terminal** and run:
```bash
anvil
```

**Keep this terminal open!** Anvil must stay running.

You should see output like:
```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...

Listening on 127.0.0.1:8545
```

## Step 2: Deploy the Contract

### Option A: Using the Deploy Script (Easiest)

In a **different terminal** (not the Anvil one), run:

```bash
cd /home/timon/foundry/token-vesting-contracts-main
./deploy.sh
```

### Option B: Manual Deployment

If the script doesn't work, run this command manually:

```bash
cd /home/timon/foundry/token-vesting-contracts-main

forge script script/DeployVestingWithToken.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Important:** The `--private-key` flag is required! This is Anvil's default account #0 private key.

## Step 3: Wait for Deployment

You should see output like:

```
== Logs ==
  Token deployed at: 0x...
  TokenVesting deployed at: 0x...
  Transferred 1,000,000 tokens to vesting contract
  
=== Deployment Summary ===
  Token Address: 0x...
  Vesting Address: 0x...

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.
```

**Copy the "Vesting Address"** - this is your contract address!

## Step 4: Update Environment Files

### Update Frontend `.env`

Edit `frontend/.env`:
```bash
cd frontend
nano .env
```

Make sure it has (replace with YOUR deployed address):
```env
VITE_CONTRACT_ADDRESS=0x...YOUR_ADDRESS_HERE...
VITE_RPC_URL=http://localhost:8545
VITE_BACKEND_URL=http://localhost:5000
```

**Important:** No spaces around the `=` sign!

### Update Backend `.env`

Edit `backend/.env`:
```bash
cd backend
nano .env
```

Make sure it has (replace with YOUR deployed address):
```env
CONTRACT_ADDRESS=0x...YOUR_ADDRESS_HERE...
RPC_URL=http://localhost:8545
PORT=5000
PRIVATE_KEY=your_private_key_here
```

## Step 5: Restart Services

### Restart Backend
```bash
cd backend
# Stop current server (Ctrl+C if running)
npm start
```

### Restart Frontend
```bash
cd frontend
# Stop current server (Ctrl+C if running)
npm run dev
```

## Step 6: Verify Deployment

### Check Contract is Deployed
```bash
cast code YOUR_CONTRACT_ADDRESS --rpc-url http://localhost:8545
```

If you see a long hex string (starts with `0x6080604052...`), the contract is deployed! ✅

If you see just `0x`, the contract is NOT deployed. ❌

### Check Backend Connection
```bash
curl http://localhost:5000/stats
```

Should return JSON with contract statistics.

## Troubleshooting

### Error: "Anvil is not running"
- **Solution:** Start Anvil in a separate terminal: `anvil`

### Error: "Connection refused"
- **Solution:** Make sure Anvil is running on port 8545
- Check: `curl http://localhost:8545`

### Error: "No associated wallet" or "Unlocked wallets: []"
- **Solution:** Add the `--private-key` flag with Anvil's default key:
  ```bash
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  ```

### Error: "Insufficient funds"
- **Solution:** Use Anvil's default accounts (they have 10,000 ETH each)
- Make sure you're using the `--private-key` flag with the default key

### Error: "Contract not found" after deployment
- **Solution:** 
  1. Double-check the address in both `.env` files
  2. Make sure there are NO spaces around `=` in `.env` files
  3. Restart both frontend and backend
  4. Clear browser cache (Ctrl+Shift+R)

### Deployment seems to hang
- **Solution:** Wait a bit longer, or check Anvil terminal for errors
- Try deploying again

## Quick Reference

**Anvil Default Account #0:**
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Deployment Command:**
```bash
forge script script/DeployVestingWithToken.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## Need Help?

If deployment still fails:
1. Check Anvil is running: `curl http://localhost:8545`
2. Check you're in the right directory
3. Check Foundry is installed: `forge --version`
4. Look at the error message carefully - it usually tells you what's wrong










