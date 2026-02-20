# 💰 How to Get Fake ETH for Testing

Since you're using **Anvil** (local blockchain), you need to import one of Anvil's pre-funded accounts into MetaMask. Each account comes with **10,000 ETH** for free!

## 🚀 Quick Solution

### Step 1: Get Anvil's Default Private Keys

Anvil provides 10 pre-funded accounts. Here are the first 3 (all have 10,000 ETH):

**Account #0 (Recommended):**
- **Address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Balance:** 10,000 ETH

**Account #1:**
- **Address:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Private Key:** `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
- **Balance:** 10,000 ETH

**Account #2:**
- **Address:** `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- **Private Key:** `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- **Balance:** 10,000 ETH

### Step 2: Import Account into MetaMask

1. **Open MetaMask** in your browser
2. Click the **account icon** (circle) in the top right
3. Click **"Import Account"**
4. Select **"Private Key"** as the import method
5. **Paste one of the private keys above** (e.g., Account #0)
6. Click **"Import"**

✅ You now have 10,000 ETH in MetaMask!

### Step 3: Connect MetaMask to Local Network

MetaMask needs to be connected to your local Anvil network:

1. **Open MetaMask**
2. Click the **network dropdown** (top center, usually shows "Ethereum Mainnet")
3. Click **"Add Network"** → **"Add a network manually"**
4. Fill in these details:
   - **Network Name:** `Localhost 8545`
   - **RPC URL:** `http://localhost:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
   - **Block Explorer:** (leave empty)
5. Click **"Save"**
6. **Switch to this network** in MetaMask

### Step 4: Verify You Have ETH

1. In MetaMask, check your **balance** - it should show **10,000 ETH**
2. Make sure you're on the **"Localhost 8545"** network
3. Your address should be one of the Anvil accounts (e.g., `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`)

## ✅ You're Ready!

Now you can:
- ✅ Create vesting schedules
- ✅ Release tokens
- ✅ Revoke schedules
- ✅ All transactions will work smoothly!

## 🔍 Verify Anvil is Running

If you're not sure if Anvil is running, check:

```bash
curl http://localhost:8545
```

Or check the terminal where you started Anvil - you should see:
```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

## 🎯 All Anvil Default Accounts

If you need more accounts, here are all 10:

| Account | Address | Private Key |
|---------|---------|-------------|
| #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| #3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f419141751be55f106a372e52008c1fed4` |
| #4 | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f4cbed6154083` |
| #5 | `0x9965507D1a55bcC2695C58ba16FB37d819F0A4BF` | `0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba` |
| #6 | `0x976EA74026E726554dB657fA54763abd0C3a0aa9` | `0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e` |
| #7 | `0x14dC79964e2C48136836a8FE058929b007c79675` | `0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356` |
| #8 | `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f` | `0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97` |
| #9 | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` | `0x2a871d0798f97d79848a013d4936a73bf4cc922c33d4c2198ddb2d435eed9f8f` |

## ⚠️ Important Notes

1. **These are TEST accounts only** - Never use these private keys on mainnet or any real network!
2. **Anvil must be running** - If you restart Anvil, the accounts reset but keep the same addresses
3. **Network must match** - Make sure MetaMask is connected to `localhost:8545` (Chain ID: 31337)
4. **Refresh after importing** - Sometimes you need to refresh the page after importing the account

## 🐛 Troubleshooting

### "Insufficient funds" error
- Make sure you imported the account correctly
- Check that you're on the "Localhost 8545" network
- Verify Anvil is running: `curl http://localhost:8545`

### "Network mismatch" error
- Make sure MetaMask is connected to `localhost:8545` (Chain ID: 31337)
- The frontend should automatically detect the network, but you can manually switch

### "Transaction failed"
- Check that Anvil is still running
- Make sure the contract is deployed
- Check browser console (F12) for detailed error messages

## 🎉 That's It!

You now have 10,000 ETH to test with! Happy testing! 🚀








