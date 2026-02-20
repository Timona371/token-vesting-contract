// server.js
import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use PORT from env, but default to 5000 (frontend expects this)
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Load ABI
const ABI = JSON.parse(fs.readFileSync("./TokenVesting.json")).abi;

// Connect to network (default to localhost for development)
const RPC_URL = process.env.RPC_URL || "http://localhost:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Use wallet if private key is provided, otherwise use provider only for read operations
let wallet = null;
let vesting = null;

if (process.env.PRIVATE_KEY) {
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
}

// Contract address (can be set via env or default)
const contractAddress = process.env.CONTRACT_ADDRESS || "0x3d222890f47Aabe7f39a94248DF56AFc36D5d1Ae";

if (contractAddress) {
  vesting = new ethers.Contract(contractAddress, ABI, wallet || provider);
}

// Health check
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running successfully!", contractAddress });
});

// Get wallet info (if wallet is configured)
app.get("/wallet-info", async (req, res) => {
  try {
    if (!wallet) {
      return res.status(400).json({ error: "Wallet not configured" });
    }
    const address = await wallet.getAddress();
    const balance = await provider.getBalance(address);
    res.json({
      wallet: address,
      balance: ethers.formatEther(balance) + " ETH",
      network: await provider.getNetwork(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching wallet info" });
  }
});

// Get vesting schedules for a beneficiary
app.get("/vesting/:address", async (req, res) => {
  try {
    const userAddress = req.params.address;
    const count = await vesting.getVestingSchedulesCountByBeneficiary(userAddress);
    const schedules = [];
    
    for (let i = 0; i < count; i++) {
      const schedule = await vesting.getVestingScheduleByAddressAndIndex(userAddress, i);
      const scheduleId = await vesting.computeVestingScheduleIdForAddressAndIndex(userAddress, i);
      let releasable = "0";
      try {
        const releasableResult = await vesting.computeReleasableAmount(scheduleId);
        releasable = releasableResult ? releasableResult.toString() : "0";
      } catch (error) {
        console.warn(`Error computing releasable amount for schedule ${i}:`, error.message);
        releasable = "0";
      }
      
      // Ensure all values are valid strings, not NaN
      schedules.push({
        scheduleId,
        beneficiary: schedule.beneficiary || "",
        cliff: schedule.cliff ? schedule.cliff.toString() : "0",
        start: schedule.start ? schedule.start.toString() : "0",
        duration: schedule.duration ? schedule.duration.toString() : "0",
        slicePeriodSeconds: schedule.slicePeriodSeconds ? schedule.slicePeriodSeconds.toString() : "0",
        revocable: schedule.revocable || false,
        amountTotal: schedule.amountTotal ? schedule.amountTotal.toString() : "0",
        released: schedule.released ? schedule.released.toString() : "0",
        revoked: schedule.revoked || false,
        releasable: releasable,
      });
    }
    
    res.json({ count: count.toString(), schedules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching vesting info", message: err.message });
  }
});

// Get all vesting schedules
app.get("/vesting-schedules", async (req, res) => {
  try {
    const count = await vesting.getVestingSchedulesCount();
    const schedules = [];
    
    for (let i = 0; i < count; i++) {
      const scheduleId = await vesting.getVestingIdAtIndex(i);
      const schedule = await vesting.getVestingSchedule(scheduleId);
      let releasable = "0";
      try {
        const releasableResult = await vesting.computeReleasableAmount(scheduleId);
        releasable = releasableResult ? releasableResult.toString() : "0";
      } catch (error) {
        console.warn(`Error computing releasable amount for schedule ${i}:`, error.message);
        releasable = "0";
      }
      
      // Ensure all values are valid strings, not NaN
      schedules.push({
        scheduleId,
        beneficiary: schedule.beneficiary || "",
        cliff: schedule.cliff ? schedule.cliff.toString() : "0",
        start: schedule.start ? schedule.start.toString() : "0",
        duration: schedule.duration ? schedule.duration.toString() : "0",
        slicePeriodSeconds: schedule.slicePeriodSeconds ? schedule.slicePeriodSeconds.toString() : "0",
        revocable: schedule.revocable || false,
        amountTotal: schedule.amountTotal ? schedule.amountTotal.toString() : "0",
        released: schedule.released ? schedule.released.toString() : "0",
        revoked: schedule.revoked || false,
        releasable: releasable,
      });
    }
    
    res.json({ count: count.toString(), schedules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching vesting schedules", message: err.message });
  }
});

// Get contract stats
app.get("/stats", async (req, res) => {
  try {
    const totalAmount = await vesting.getVestingSchedulesTotalAmount();
    const withdrawable = await vesting.getWithdrawableAmount();
    const count = await vesting.getVestingSchedulesCount();
    const tokenAddress = await vesting.getToken();
    const owner = await vesting.owner();
    
    res.json({
      totalAmount: totalAmount.toString(),
      withdrawable: withdrawable.toString(),
      count: count.toString(),
      tokenAddress,
      owner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching stats", message: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Backend server running on http://localhost:${PORT}`)
);
