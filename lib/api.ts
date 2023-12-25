import { env } from '@/env.mjs';
import axios from 'axios';

const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
