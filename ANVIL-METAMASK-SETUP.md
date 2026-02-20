# 🚀 Automatic Anvil + MetaMask Setup

I've added an **automatic setup helper** to your frontend that makes it super easy to connect Anvil to MetaMask and get free ETH!

## ✨ What's New

A new **"Anvil Setup Helper"** component appears at the top of your dashboard that:

1. ✅ **Automatically adds the Localhost network** to MetaMask (one click!)
2. ✅ **Helps you import an Anvil account** with 10,000 ETH
3. ✅ **Copies the private key** to your clipboard automatically
4. ✅ **Shows step-by-step instructions** for importing

## 🎯 How to Use

### Step 1: Open Your Frontend

Make sure your frontend is running:
```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Step 2: Use the Anvil Setup Helper

You'll see a blue card at the top that says **"🔧 Anvil Setup Helper"**.

**Click "➕ Add Localhost Network to MetaMask"**
- This will automatically add the Anvil network to MetaMask
- MetaMask will ask you to approve - click "Approve" or "Add Network"

**Then click "📋 Copy Private Key & Show Instructions"**
- This copies the private key to your clipboard
- Follow the popup instructions to import the account in MetaMask

### Step 3: Import Account in MetaMask

1. Open MetaMask
2. Click the **account icon** (circle) in the top right
3. Click **"Import Account"**
4. Select **"Private Key"**
5. **Paste the key** (it's already in your clipboard!)
6. Click **"Import"**

✅ **Done!** You now have 10,000 ETH!

## 🎉 What You Get

- **Network:** Localhost 8545 (Chain ID: 31337)
- **Account:** One of Anvil's pre-funded accounts
- **Balance:** 10,000 ETH (free for testing!)
- **Ready to:** Create vesting schedules, release tokens, etc.

## 🔍 Available Accounts

The helper shows 3 accounts you can choose from:
- **Account #0:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (10,000 ETH)
- **Account #1:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (10,000 ETH)
- **Account #2:** `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` (10,000 ETH)

All accounts have the same balance - pick any one!

## ⚠️ Important Notes

1. **Anvil must be running** - Make sure you have `anvil` running in a terminal
2. **Network auto-detection** - The helper automatically detects if you're already on the correct network
3. **Account auto-detection** - The helper detects if you've already imported an Anvil account
4. **One-click network add** - The network is added automatically, no manual configuration needed!

## 🐛 Troubleshooting

### "MetaMask is not installed"
- Install MetaMask browser extension first
- Refresh the page after installing

### "Network request is pending"
- Check MetaMask - there might be a pending request
- Approve or reject the request in MetaMask

### "Failed to add network"
- Make sure Anvil is running: `curl http://localhost:8545`
- Try refreshing the page and clicking again

### Still have 0 ETH?
- Make sure you imported the account correctly
- Check that you're on the "Localhost 8545" network in MetaMask
- Verify Anvil is running and has accounts

## 🎯 Quick Test

After setup, try:
1. Connect your wallet (should show the Anvil account)
2. Check your balance (should show 10,000 ETH)
3. Create a vesting schedule (should work without "insufficient funds" errors!)

## 📝 Technical Details

The helper uses:
- `wallet_addEthereumChain` - MetaMask API to add networks
- `wallet_switchEthereumChain` - MetaMask API to switch networks
- Clipboard API - To copy private keys automatically
- Auto-detection - Checks network and account status on load

Everything is automatic - just click the buttons! 🚀








