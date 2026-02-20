# 🔧 Fix: Still Showing 0 ETH Issue

If you've imported an Anvil account but still see 0 ETH, here's how to fix it:

## ✅ Quick Diagnostic

I've added a **Network Checker** component that will automatically diagnose the issue. It shows:
- ✅/❌ Network status (are you on Localhost 8545?)
- ✅/❌ Account status (did you import an Anvil account?)
- 💰 Your current balance

## 🔍 Common Issues & Fixes

### Issue 1: Wrong Network ⚠️

**Problem:** You're on the wrong network (e.g., Mainnet, Sepolia, etc.)

**Solution:**
1. Look at the **Network Checker** card at the top of the page
2. If it says "❌ Wrong network!", click **"🔄 Switch to Localhost 8545"**
3. Or manually switch in MetaMask:
   - Click network dropdown in MetaMask
   - Select "Localhost 8545" (Chain ID: 31337)
   - If it's not there, add it using the Anvil Setup Helper

### Issue 2: Wrong Account ⚠️

**Problem:** You imported a different account, not an Anvil account

**Solution:**
1. Check the **Network Checker** - it will tell you if your account is an Anvil account
2. If it says "⚠️ Not an Anvil account", you need to:
   - Import one of the Anvil accounts using the Anvil Setup Helper
   - Use Account #0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### Issue 3: Anvil Not Running ⚠️

**Problem:** Anvil is not running, so the network doesn't exist

**Solution:**
1. Check if Anvil is running:
   ```bash
   curl http://localhost:8545
   ```
2. If it fails, start Anvil:
   ```bash
   anvil
   ```
3. Keep Anvil running in a terminal window

### Issue 4: MetaMask Cache ⚠️

**Problem:** MetaMask is showing cached/old data

**Solution:**
1. **Refresh the page** (Ctrl+Shift+R or Cmd+Shift+R)
2. In MetaMask, click the **three dots** (⋮) → **Settings** → **Advanced** → **Reset Account**
3. Or disconnect and reconnect your wallet

## 📋 Step-by-Step Fix

### Step 1: Check Network Checker

Look at the **Network Checker** card at the top of your dashboard. It will show:
- ✅ Network status
- ✅ Account status  
- 💰 Your balance

### Step 2: Fix Network (if needed)

If network is wrong:
1. Click **"🔄 Switch to Localhost 8545"** button
2. Or use the Anvil Setup Helper to add the network

### Step 3: Fix Account (if needed)

If account is wrong:
1. Use the **Anvil Setup Helper** to import Account #0
2. Click "Copy Private Key"
3. In MetaMask: Account icon → Import Account → Private Key → Paste → Import

### Step 4: Verify

1. Click **"🔄 Refresh Status"** in the Network Checker
2. You should see:
   - ✅ Connected to Localhost 8545
   - ✅ Anvil account connected
   - 💰 10000.0000 ETH

## 🎯 Quick Test

After fixing, try this:
1. Make sure Network Checker shows ✅ for everything
2. Try creating a vesting schedule
3. It should work without "insufficient funds" errors!

## 🔑 Anvil Account #0 (Recommended)

If you need to re-import:

**Address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`  
**Private Key:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`  
**Balance:** 10,000 ETH

## 💡 Pro Tip

The **Network Checker** updates automatically every 2 seconds, so you can see changes in real-time as you fix things!

## 🆘 Still Not Working?

1. **Check browser console** (F12) for errors
2. **Verify Anvil is running:** `curl http://localhost:8545`
3. **Check MetaMask:** Make sure it's unlocked and connected
4. **Try a different browser** or clear cache
5. **Restart everything:** Anvil, backend, frontend, browser

The Network Checker will guide you through fixing any issues! 🚀








