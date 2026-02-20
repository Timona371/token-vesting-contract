# Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- MetaMask browser extension
- A local blockchain (Anvil) or testnet access

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env in backend/)
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x3d222890f47Aabe7f39a94248DF56AFc36D5d1Ae
PORT=5000
```

### Frontend (.env in frontend/)
```env
VITE_CONTRACT_ADDRESS=0x3d222890f47Aabe7f39a94248DF56AFc36D5d1Ae
VITE_RPC_URL=http://localhost:8545
VITE_BACKEND_URL=http://localhost:5000
```

## Step 3: Start Local Blockchain (if using Anvil)

```bash
# In a separate terminal
anvil
```

## Step 4: Deploy Contract (if not already deployed)

```bash
forge script script/DeployVesting.s.sol --rpc-url http://localhost:8545 --broadcast
```

Update the contract address in both .env files after deployment.

## Step 5: Start Backend

```bash
cd backend
npm start
```

Backend runs on http://localhost:5000

## Step 6: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:3000

## Step 7: Use the Application

1. Open http://localhost:3000 in your browser
2. Click "Connect Wallet" and approve in MetaMask
3. Make sure MetaMask is connected to the same network (localhost:8545)
4. Start creating and managing vesting schedules!

## Troubleshooting

- **"MetaMask not found"**: Install MetaMask browser extension
- **"Network mismatch"**: Ensure MetaMask is connected to the correct network
- **"Contract not found"**: Verify the contract address in .env files
- **"Backend connection failed"**: Ensure backend is running on port 5000













