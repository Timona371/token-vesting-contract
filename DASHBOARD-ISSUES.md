# Dashboard Issues & Solutions

## 🔍 Problems Found

### 1. **Backend Server Not Running** ❌
- **Issue**: The backend server is not running, causing the dashboard to fail when trying to fetch data.
- **Solution**: Start the backend server.

### 2. **Port Mismatch** ⚠️
- **Issue**: Backend `.env` had `PORT=5500` but frontend expects `PORT=5000`.
- **Solution**: ✅ Fixed - Updated backend `.env` to use port 5000.

### 3. **Contract Address** ✅
- **Status**: Contract is properly deployed at `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
- **Status**: Environment variables are correctly configured.

## 🚀 How to Fix

### Step 1: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Backend server running on http://localhost:5000
```

### Step 2: Verify Backend is Running

Open a new terminal and test:
```bash
curl http://localhost:5000/stats
```

You should get a JSON response with contract statistics.

### Step 3: Restart Frontend (if needed)

If the frontend is already running, refresh your browser. If not:

```bash
cd frontend
npm run dev
```

### Step 4: Check Browser Console

Open your browser's developer console (F12) and check for any errors:
- Network errors (CORS, connection refused)
- JavaScript errors
- Contract interaction errors

## 📋 Common Issues Checklist

- [ ] ✅ Contract deployed at correct address
- [ ] ✅ Anvil is running (`anvil` command)
- [ ] ✅ Backend server is running (`npm start` in backend/)
- [ ] ✅ Frontend server is running (`npm run dev` in frontend/)
- [ ] ✅ Port 5000 is available (backend)
- [ ] ✅ Port 3000 is available (frontend)
- [ ] ✅ MetaMask is connected to localhost:8545
- [ ] ✅ Environment variables are set correctly

## 🔧 Quick Diagnostic Commands

```bash
# Check if Anvil is running
pgrep -f anvil

# Check if backend is running
pgrep -f "node.*backend"

# Check if frontend is running
pgrep -f "vite"

# Test backend connection
curl http://localhost:5000/stats

# Test contract deployment
cast code 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 --rpc-url http://localhost:8545
```

## 🎯 Expected Behavior

Once everything is running:

1. **Dashboard loads** without errors
2. **Contract verification** shows ✅ (green checkmark or no warning)
3. **Stats section** displays contract statistics
4. **Wallet connection** works with MetaMask
5. **Create vesting schedule** form is functional
6. **Vesting schedules list** shows your schedules (if any)

## 🐛 If Issues Persist

1. **Check browser console** for specific error messages
2. **Check backend terminal** for server errors
3. **Verify network tab** in browser DevTools for failed requests
4. **Ensure MetaMask** is connected to the correct network (localhost:8545)
5. **Clear browser cache** and hard refresh (Ctrl+Shift+R)










