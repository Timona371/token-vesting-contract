# 🚀 How to Deploy the Contract

## Quick Method (Easiest)

### Step 1: Make sure Anvil is running
```bash
anvil
```
*(Keep this terminal open - Anvil should be running)*

### Step 2: Deploy the contract
From the project root directory, run:

```bash
./deploy.sh
```

OR manually:
```bash
forge script script/DeployVestingWithToken.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast
```

### Step 3: Copy the contract address
After deployment, you'll see output like:
```
TokenVesting deployed at: 0x...
```

### Step 4: Update environment files
Update the contract address in both `.env` files:

**Frontend** (`frontend/.env`):
```env
VITE_CONTRACT_ADDRESS=0x... (your new address)
```

**Backend** (`backend/.env`):
```env
CONTRACT_ADDRESS=0x... (your new address)
```

### Step 5: Restart services
```bash
# Restart backend (Ctrl+C to stop, then):
cd backend && npm start

# Restart frontend (in new terminal, Ctrl+C to stop, then):
cd frontend && npm run dev
```

### Step 6: Refresh browser
Refresh your browser - the dashboard should now show the contract is deployed!

---

## What the Script Does

The `DeployVestingWithToken.s.sol` script:
1. ✅ Deploys a new ERC20 token (10 million tokens)
2. ✅ Deploys the TokenVesting contract
3. ✅ Transfers 1 million tokens to the vesting contract for testing
4. ✅ Prints the addresses you need

---

## Troubleshooting

**"Anvil is not running"**
- Start Anvil: `anvil`
- Keep it running in a separate terminal

**"Connection refused"**
- Make sure Anvil is running on port 8545
- Check: `curl http://localhost:8545`

**"Contract not found" after deployment**
- Make sure you updated BOTH `.env` files
- Restart both frontend and backend
- Clear browser cache (Ctrl+Shift+R)

---

## Current Status

✅ Anvil is running
✅ Deployment script is ready
✅ Contract can be deployed with one command










