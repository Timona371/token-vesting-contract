import axios from 'axios';
import { BACKEND_URL } from './web3';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

export async function getVestingSchedules(address) {
  const { data } = await api.get(`/vesting/${address}`);
  return data;
}

export async function getAllVestingSchedules() {
  const { data } = await api.get('/vesting-schedules');
  return data;
}
