import { AgentProfile } from './types';

export const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent';

export const API_KEYS: Record<AgentProfile, string> = {
  finance: 'AIzaSyB1NYD9lWVT7pxbw9jjtvHMV4BPkDCB1Hk',
  sales: 'AIzaSyDTuFvh04sqEiEMZmdZ9_OY7wyKefuIvHE', 
  hr: 'AIzaSyAWpAoZrwzSsikh6JR6hNiDdHO4AMP3UB4',
  business: 'AIzaSyB2Xwpx-v5pmUwLfwIvTlLvOgAkRl3rBhg',
  strategy: 'AIzaSyB1NYD9lWVT7pxbw9jjtvHMV4BPkDCB1Hk'
};