# Token Vesting System Lifecycle

## 1. Project Purpose
This project implements a secure blockchain-based token vesting solution where tokens are locked in a smart contract and released over time using predefined vesting rules.

### Objectives Covered
- `ii.` Design a secure blockchain-based token vesting system with time-based release rules.
- `iii.` Develop a smart contract that controls token locking.
- Document the full lifecycle of the token vesting solution.

## 2. Requirements Phase
### Functional Requirements
- Contract owner can create vesting schedules.
- Each schedule defines beneficiary, start time, cliff, duration, slice period, revocability, and token amount.
- Beneficiaries can claim vested tokens as they become releasable.
- Owner can revoke revocable schedules.
- Owner can withdraw withdrawable (unallocated) tokens.

### Non-Functional Requirements
- Security-first contract logic (authorization, input validation, predictable release logic).
- Transparent and auditable on-chain state.
- Usable dashboard for schedule creation and claims.
- Local test/deploy workflow for reproducibility.

## 3. System Design Phase
### Architecture
- `Smart Contract Layer`: `src/TokenVesting.sol` enforces vesting logic and token custody.
- `Backend Layer`: `backend/server.js` provides read APIs for dashboard stats and schedules.
- `Frontend Layer`: `frontend/src/App.jsx` handles wallet connection, schedule creation, and claiming.
- `Blockchain Node`: Local Anvil network (`chainId 31337`) for development/testing.

### Vesting Model
- Time-based release uses:
  - `start`
  - `cliff`
  - `duration`
  - `slicePeriodSeconds`
- Releasable amount is computed on-chain and cannot exceed allocated total.

## 4. Implementation Phase
### Smart Contract
- Implemented `createVestingSchedule`, `release`, `revoke`, and vesting query functions.
- Contract stores vesting schedules and controls all token locking/release behavior.
- Token balances are managed via ERC-20 transfer semantics.

### Backend
- Implemented endpoints for:
  - health check
  - contract stats
  - vesting schedules by beneficiary
  - all schedules
- Uses `ethers` provider/wallet and contract ABI from `backend/TokenVesting.json`.

### Frontend
- Wallet connection with MetaMask.
- Form to create schedules (owner flow).
- Table view for schedules and releasable amounts.
- Claim single/claim all actions.
- Added contract deployment check to prevent silent misconfiguration.

## 5. Testing and Validation Phase
### Validation Performed
- Contract build and script deployment via Foundry.
- Frontend build verification with Vite.
- Runtime checks for:
  - contract address mismatch
  - backend/RPC connectivity failures
  - schedule refresh and claim flow

### Recommended Additional Tests
- Unit tests for edge conditions (zero duration, invalid slice, revoke/release boundaries).
- Integration tests for full owner-to-beneficiary flow.
- Negative tests for unauthorized actions.

## 6. Deployment Phase
### Local Deployment Flow
- Run local node on `http://localhost:8545`.
- Deploy using Foundry script:
  - `script/DeployVestingWithToken.s.sol`
- Set deployed vesting address in:
  - `frontend/.env` as `VITE_CONTRACT_ADDRESS`
  - `backend/.env` as `CONTRACT_ADDRESS`

### Current Working Local Address
- `0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6` (chain `31337`)

## 7. Operations and Maintenance Phase
### Operational Checklist
- Keep frontend, backend, and wallet on same chain/network.
- Verify contract code exists at configured address before use.
- Monitor backend availability (`/` health endpoint).
- Re-deploy and update env values whenever local chain state is reset.

### Security Maintenance
- Protect private keys and `.env` files.
- Restrict owner operations to authorized wallet.
- Review contract logic before production/testnet deployment.

## 8. Risk Assessment and Mitigations
- `Risk`: Wrong contract address or chain mismatch.
  - `Mitigation`: Deployment check in frontend and shared env configuration.
- `Risk`: Backend downtime causing dashboard errors.
  - `Mitigation`: On-chain schedule reads and independent refresh error handling.
- `Risk`: Unauthorized schedule management.
  - `Mitigation`: Ownership checks in contract functions.
- `Risk`: Insufficient contract token funding.
  - `Mitigation`: Initial token transfer and withdrawable amount checks.

## 9. Objective Completion Statement
- Objective `ii` is achieved through the implemented time-based vesting architecture and rules.
- Objective `iii` is achieved through `TokenVesting.sol`, which enforces token locking and controlled release.
- Lifecycle documentation objective is achieved by this document.

