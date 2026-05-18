const apiHost = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let base = apiHost.startsWith('http://') || apiHost.startsWith('https://')
  ? apiHost
  : (apiHost.includes('localhost') ? `http://${apiHost}` : `https://${apiHost}`);

// Remove trailing slash if present
base = base.replace(/\/$/, '');

// Ensure /api is at the end if it isn't already included
export const API_URL = base.endsWith('/api') ? base : `${base}/api`;
