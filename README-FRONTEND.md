# Token Vesting Platform - Full Stack Application

This is a complete full-stack application for managing ERC20 token vesting schedules.

## Project Structure

```
token-vesting-contracts-main/
├── src/                    # Solidity smart contracts
│   └── TokenVesting.sol
├── backend/               # Node.js/Express backend API
│   ├── server.js
│   └── TokenVesting.json  # Contract ABI
└── frontend/              # React frontend
    ├── src/
    │   ├── components/
    │   ├── utils/
    │   └── App.jsx
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PRIVATE_KEY=your_private_key_here
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x3d222890f47Aabe7f39a94248DF56AFc36D5d1Ae
PORT=5000
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_CONTRACT_ADDRESS=0x3d222890f47Aabe7f39a94248DF56AFc36D5d1Ae
VITE_RPC_URL=http://localhost:8545
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Deploy Smart Contract

If you haven't deployed the contract yet:

```bash
# From the root directory
forge script script/DeployVesting.s.sol --rpc-url http://localhost:8545 --broadcast
```

Update the contract address in both `.env` files after deployment.

## Features

### Frontend Features:
- ✅ Connect MetaMask wallet
- ✅ View contract statistics
- ✅ Create new vesting schedules
- ✅ View all your vesting schedules
- ✅ Release vested tokens
- ✅ Revoke vesting schedules (if revocable)
- ✅ Beautiful, modern UI

### Backend Features:
- ✅ RESTful API for contract interactions
- ✅ Get vesting schedules by address
- ✅ Get all vesting schedules
- ✅ Get contract statistics
- ✅ CORS enabled for frontend integration

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve the MetaMask connection
2. **View Stats**: See total vesting amount, withdrawable amount, and total schedules
3. **Create Schedule**: Fill out the form to create a new vesting schedule
4. **Manage Schedules**: View, release, or revoke your vesting schedules

## API Endpoints

- `GET /` - Health check
- `GET /wallet-info` - Get wallet information
- `GET /vesting/:address` - Get vesting schedules for an address
- `GET /vesting-schedules` - Get all vesting schedules
- `GET /stats` - Get contract statistics

## Development

### Backend
- Uses Express.js for the API server
- Uses ethers.js v6 for blockchain interactions
- Supports both read and write operations

### Frontend
- Built with React and Vite
- Uses ethers.js for Web3 interactions
- Modern, responsive UI with gradient design
- Real-time updates after transactions

## Notes

- Make sure MetaMask is installed in your browser
- Ensure you're connected to the correct network (localhost for development)
- The contract address must be set correctly in both frontend and backend
- For production, update the RPC URLs to your production network













