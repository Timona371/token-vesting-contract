import { ethers } from 'ethers';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'http://localhost:8545';
export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const VESTING_ABI = [
  'function createVestingSchedule(address _beneficiary, uint256 _start, uint256 _cliff, uint256 _duration, uint256 _slicePeriodSeconds, bool _revocable, uint256 _amount)',
  'function release(bytes32 vestingScheduleId, uint256 amount)',
  'function computeReleasableAmount(bytes32 vestingScheduleId) view returns (uint256)',
  'function getVestingSchedulesCount() view returns (uint256)',
  'function getVestingIdAtIndex(uint256 index) view returns (bytes32)',
  'function getVestingSchedule(bytes32 vestingScheduleId) view returns (tuple(address beneficiary, uint256 cliff, uint256 start, uint256 duration, uint256 slicePeriodSeconds, bool revocable, uint256 amountTotal, uint256 released, bool revoked))',
  'function getVestingSchedulesCountByBeneficiary(address _beneficiary) view returns (uint256)',
  'function getVestingScheduleByAddressAndIndex(address holder, uint256 index) view returns (tuple(address beneficiary, uint256 cliff, uint256 start, uint256 duration, uint256 slicePeriodSeconds, bool revocable, uint256 amountTotal, uint256 released, bool revoked))',
  'function computeVestingScheduleIdForAddressAndIndex(address holder, uint256 index) pure returns (bytes32)',
  'function getToken() view returns (address)',
  'function owner() view returns (address)',
];

export const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export function formatAddress(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatUnitsSafe(value, decimals = 18) {
  try {
    return ethers.formatUnits(value ?? 0, decimals);
  } catch {
    return '0';
  }
}

export function toBigIntSafe(v) {
  try {
    if (typeof v === 'bigint') return v;
    if (v === null || v === undefined) return 0n;
    const s = typeof v === 'string' ? v : v.toString();
    if (!s || s === 'NaN') return 0n;
    return BigInt(s);
  } catch {
    return 0n;
  }
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, address };
}

export function getVestingContract(signerOrProvider) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error('VITE_CONTRACT_ADDRESS is not set');
  }
  return new ethers.Contract(CONTRACT_ADDRESS, VESTING_ABI, signerOrProvider);
}

export async function assertVestingContractDeployed(provider) {
  const [network, code] = await Promise.all([
    provider.getNetwork(),
    provider.getCode(CONTRACT_ADDRESS),
  ]);

  if (!code || code === '0x') {
    throw new Error(
      `Vesting contract not deployed at ${CONTRACT_ADDRESS} on chain ${network.chainId.toString()}`
    );
  }
}

export async function getTokenMetaAndBalance({ vestingContract, account }) {
  const tokenAddress = await vestingContract.getToken();
  const runner = vestingContract.runner?.provider ?? vestingContract.runner;
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, runner);
  const [bal, decimals, symbol] = await Promise.all([
    token.balanceOf(account),
    token.decimals().catch(() => 18),
    token.symbol().catch(() => 'TOKEN'),
  ]);
  return { tokenAddress, balance: bal, decimals, symbol };
}

export async function getAllSchedulesFromContract(vestingContract) {
  const count = Number(await vestingContract.getVestingSchedulesCount());
  const schedules = [];

  for (let i = 0; i < count; i++) {
    const scheduleId = await vestingContract.getVestingIdAtIndex(i);
    const schedule = await vestingContract.getVestingSchedule(scheduleId);
    let releasable = 0n;
    try {
      releasable = await vestingContract.computeReleasableAmount(scheduleId);
    } catch {
      releasable = 0n;
    }

    schedules.push({
      scheduleId,
      beneficiary: schedule.beneficiary || '',
      cliff: (schedule.cliff ?? 0n).toString(),
      start: (schedule.start ?? 0n).toString(),
      duration: (schedule.duration ?? 0n).toString(),
      slicePeriodSeconds: (schedule.slicePeriodSeconds ?? 0n).toString(),
      revocable: Boolean(schedule.revocable),
      amountTotal: (schedule.amountTotal ?? 0n).toString(),
      released: (schedule.released ?? 0n).toString(),
      revoked: Boolean(schedule.revoked),
      releasable: releasable.toString(),
    });
  }

  return schedules;
}
