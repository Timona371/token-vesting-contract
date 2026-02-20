import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { getAllVestingSchedules, getStats } from './lib/api';
import {
  assertVestingContractDeployed,
  connectWallet,
  formatAddress,
  formatUnitsSafe,
  getAllSchedulesFromContract,
  getTokenMetaAndBalance,
  getVestingContract,
  toBigIntSafe,
} from './lib/web3';

function getDefaultStartDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 16);
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [vesting, setVesting] = useState(null);

  const [stats, setStats] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [tokenInfo, setTokenInfo] = useState(null);

  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(() => ({
    beneficiary: '',
    start: getDefaultStartDate(),
    cliffDays: '0',
    durationDays: '365',
    sliceDays: '30',
    revocable: true,
    amount: '1000',
  }));

  const totals = useMemo(() => {
    let total = 0n;
    let released = 0n;
    let releasable = 0n;
    let locked = 0n;
    for (const s of schedules) {
      if (s?.revoked) continue;
      const t = toBigIntSafe(s.amountTotal);
      const r = toBigIntSafe(s.released);
      const rel = toBigIntSafe(s.releasable);
      const l = t > (r + rel) ? (t - r - rel) : 0n;
      total += t;
      released += r;
      releasable += rel;
      locked += l;
    }
    return { total, released, releasable, locked };
  }, [schedules]);

  async function refreshAll(
    opts = { schedules: true, stats: true, token: true },
    ctx = { vestingOverride: null, accountOverride: null }
  ) {
    const currentVesting = ctx.vestingOverride ?? vesting;
    const currentAccount = ctx.accountOverride ?? account;
    const errors = [];

    setError(null);

    if (opts.stats) {
      try {
        setStats(await getStats());
      } catch (e) {
        errors.push(`Stats: ${e?.message || 'failed'}`);
      }
    }

    if (opts.schedules) {
      // Prefer direct on-chain reads when wallet is connected.
      if (currentVesting) {
        try {
          setSchedules(await getAllSchedulesFromContract(currentVesting));
        } catch (e) {
          errors.push(`Schedules(on-chain): ${e?.message || 'failed'}`);
          try {
            const data = await getAllVestingSchedules();
            setSchedules(Array.isArray(data.schedules) ? data.schedules : []);
          } catch (e2) {
            errors.push(`Schedules(api): ${e2?.message || 'failed'}`);
          }
        }
      } else {
        try {
          const data = await getAllVestingSchedules();
          setSchedules(Array.isArray(data.schedules) ? data.schedules : []);
        } catch (e) {
          errors.push(`Schedules(api): ${e?.message || 'failed'}`);
        }
      }
    }

    if (opts.token && currentVesting && currentAccount) {
      try {
        setTokenInfo(await getTokenMetaAndBalance({ vestingContract: currentVesting, account: currentAccount }));
      } catch (e) {
        errors.push(`Token: ${e?.message || 'failed'}`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join(' | '));
    }
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onConnect() {
    try {
      setBusy(true);
      setError(null);
      const { provider, signer, address } = await connectWallet();
      await assertVestingContractDeployed(provider);
      setAccount(address);
      setSigner(signer);
      const v = getVestingContract(signer);
      setVesting(v);
      setSuccess('Wallet connected');
      await refreshAll(
        { schedules: true, stats: true, token: true },
        { vestingOverride: v, accountOverride: address }
      );
    } catch (e) {
      setError(e?.message || 'Failed to connect wallet');
    } finally {
      setBusy(false);
      setTimeout(() => setSuccess(null), 2000);
    }
  }

  async function onCreateSchedule(e) {
    e.preventDefault();
    if (!vesting || !signer) return setError('Connect your wallet first');

    try {
      setBusy(true);
      setError(null);
      setSuccess(null);

      if (!ethers.isAddress(form.beneficiary)) throw new Error('Invalid beneficiary');
      const startTs = Math.floor(new Date(form.start).getTime() / 1000);
      if (!Number.isFinite(startTs)) throw new Error('Invalid start date');
      const now = Math.floor(Date.now() / 1000);
      if (startTs < now) throw new Error('Start date must be in the future');

      const cliffSeconds = Math.floor(parseFloat(form.cliffDays) * 86400);
      const durationSeconds = Math.floor(parseFloat(form.durationDays) * 86400);
      const sliceSeconds = Math.floor(parseFloat(form.sliceDays) * 86400);
      if (!Number.isFinite(cliffSeconds) || cliffSeconds < 0) throw new Error('Invalid cliff');
      if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) throw new Error('Invalid duration');
      if (!Number.isFinite(sliceSeconds) || sliceSeconds <= 0) throw new Error('Invalid slice');

      const amount = ethers.parseUnits(String(form.amount).trim(), 18);

      const tx = await vesting.createVestingSchedule(
        form.beneficiary,
        startTs,
        cliffSeconds,
        durationSeconds,
        sliceSeconds,
        form.revocable,
        amount
      );
      await tx.wait();
      setSuccess('Vesting schedule created');
      await refreshAll({ schedules: true, stats: true, token: true });
    } catch (e2) {
      setError(e2?.message || 'Failed to create schedule');
    } finally {
      setBusy(false);
      setTimeout(() => setSuccess(null), 2500);
    }
  }

  async function onRelease(scheduleId, releasableWei) {
    if (!vesting) return setError('Connect your wallet first');
    try {
      setBusy(true);
      setError(null);
      const tx = await vesting.release(scheduleId, releasableWei);
      await tx.wait();
      setSuccess('Tokens claimed');
      await refreshAll({ schedules: true, stats: true, token: true });
    } catch (e) {
      setError(e?.message || 'Claim failed');
    } finally {
      setBusy(false);
      setTimeout(() => setSuccess(null), 2500);
    }
  }

  async function onClaimAll() {
    if (!vesting || !account) return setError('Connect your wallet first');
    const candidates = schedules
      .filter((s) => !s.revoked && s.beneficiary?.toLowerCase() === account.toLowerCase())
      .map((s) => ({ id: s.scheduleId, amt: toBigIntSafe(s.releasable) }))
      .filter((x) => x.amt > 0n);

    if (candidates.length === 0) return setSuccess('Nothing to claim');

    try {
      setBusy(true);
      setError(null);
      for (const c of candidates) {
        const tx = await vesting.release(c.id, c.amt);
        await tx.wait();
      }
      setSuccess('Claimed all releasable tokens');
      await refreshAll({ schedules: true, stats: true, token: true });
    } catch (e) {
      setError(e?.message || 'Claim all failed');
    } finally {
      setBusy(false);
      setTimeout(() => setSuccess(null), 2500);
    }
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <div className="logo" />
          <div>
            <div className="title">Token Vesting</div>
            <div className="subtitle">Secure, on-chain vesting and claims</div>
          </div>
        </div>
        <div className="row">
          {account ? (
            <div className="pill">
              <span className="muted2">Wallet</span>
              <span style={{ fontWeight: 800 }}>{formatAddress(account)}</span>
            </div>
          ) : (
            <div className="pill">Not connected</div>
          )}
          <button className="btn" onClick={onConnect} disabled={busy}>
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="cardBody">
            {error && <div className="alert alertError">{error}</div>}
            {success && <div className="alert alertSuccess">{success}</div>}
            <div className="row" style={{ marginTop: 10 }}>
              <div className="muted">Overview</div>
              <button className="btn btnGhost" onClick={() => refreshAll()} disabled={busy}>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="cardHeader">
            <div className="row">
              <h3 className="h2">Balances</h3>
              <div className="pill">
                <span className="muted2">Token</span>
                <span style={{ fontWeight: 800 }}>{tokenInfo?.symbol || '—'}</span>
              </div>
            </div>
          </div>
          <div className="cardBody">
            <div className="grid" style={{ marginTop: 0 }}>
              <div className="card" style={{ gridColumn: 'span 3' }}>
                <div className="cardBody">
                  <div className="muted2">Wallet balance</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 6 }}>
                    {tokenInfo
                      ? `${formatUnitsSafe(tokenInfo.balance, tokenInfo.decimals)} ${tokenInfo.symbol}`
                      : '—'}
                  </div>
                </div>
              </div>
              <div className="card" style={{ gridColumn: 'span 3' }}>
                <div className="cardBody">
                  <div className="muted2">Locked</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 6 }}>
                    {formatUnitsSafe(totals.locked)} tokens
                  </div>
                </div>
              </div>
              <div className="card" style={{ gridColumn: 'span 3' }}>
                <div className="cardBody">
                  <div className="muted2">Releasable</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 6 }}>
                    {formatUnitsSafe(totals.releasable)} tokens
                  </div>
                </div>
              </div>
              <div className="card" style={{ gridColumn: 'span 3' }}>
                <div className="cardBody">
                  <div className="muted2">Released</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 6 }}>
                    {formatUnitsSafe(totals.released)} tokens
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="cardHeader">
            <div className="row">
              <h3 className="h2">Vesting schedules</h3>
              <div className="row">
                <span className="badge">{schedules.length} schedules</span>
                <button className="btn" onClick={onClaimAll} disabled={busy || !account || schedules.length === 0}>
                  Claim all
                </button>
              </div>
            </div>
          </div>
          <div className="cardBody">
            <table className="table">
              <thead>
                <tr>
                  <th>Beneficiary</th>
                  <th>Total</th>
                  <th>Released</th>
                  <th>Releasable</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="muted">
                      {'No schedules found yet. Create one in the form below and click Refresh.'}
                    </td>
                  </tr>
                ) : (
                  schedules.map((s) => {
                    const rel = toBigIntSafe(s.releasable);
                    const canClaim = !s.revoked && rel > 0n && s.beneficiary?.toLowerCase() === account?.toLowerCase();
                    return (
                      <tr key={s.scheduleId}>
                        <td>{formatAddress(s.beneficiary || '')}</td>
                        <td>{formatUnitsSafe(s.amountTotal)} tokens</td>
                        <td>{formatUnitsSafe(s.released)} tokens</td>
                        <td>{formatUnitsSafe(s.releasable)} tokens</td>
                        <td>
                          {s.revoked ? (
                            <span className="badge badgeBad">Revoked</span>
                          ) : rel > 0n ? (
                            <span className="badge badgeWarn">Claimable</span>
                          ) : (
                            <span className="badge">Active</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btnGhost"
                            disabled={!canClaim || busy}
                            onClick={() => onRelease(s.scheduleId, rel)}
                          >
                            Claim
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="cardHeader">
            <h3 className="h2">Create vesting schedule (owner)</h3>
            <div className="muted" style={{ marginTop: 6 }}>
              Requires the connected wallet to be the vesting contract owner.
            </div>
          </div>
          <div className="cardBody">
            <form onSubmit={onCreateSchedule}>
              <div className="grid" style={{ marginTop: 0 }}>
                <div style={{ gridColumn: 'span 6' }}>
                  <div className="muted2" style={{ marginBottom: 6 }}>
                    Beneficiary
                  </div>
                  <input
                    className="input"
                    value={form.beneficiary}
                    onChange={(e) => setForm((p) => ({ ...p, beneficiary: e.target.value }))}
                    placeholder="0x..."
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 6' }}>
                  <div className="muted2" style={{ marginBottom: 6 }}>
                    Start date
                  </div>
                  <input
                    className="input"
                    type="datetime-local"
                    value={form.start}
                    onChange={(e) => setForm((p) => ({ ...p, start: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <div className="muted2" style={{ marginBottom: 6 }}>
                    Cliff (days)
                  </div>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={form.cliffDays}
                    onChange={(e) => setForm((p) => ({ ...p, cliffDays: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <div className="muted2" style={{ marginBottom: 6 }}>
                    Duration (days)
                  </div>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={form.durationDays}
                    onChange={(e) => setForm((p) => ({ ...p, durationDays: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <div className="muted2" style={{ marginBottom: 6 }}>
                    Slice (days)
                  </div>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={form.sliceDays}
                    onChange={(e) => setForm((p) => ({ ...p, sliceDays: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <div className="muted2" style={{ marginBottom: 6 }}>
                    Amount (tokens)
                  </div>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.000001"
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: 14 }}>
                <label className="pill" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.revocable}
                    onChange={(e) => setForm((p) => ({ ...p, revocable: e.target.checked }))}
                    style={{ marginRight: 8 }}
                  />
                  Revocable
                </label>
                <button className="btn" type="submit" disabled={busy}>
                  Create schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
