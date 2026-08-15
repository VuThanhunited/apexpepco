import { io } from 'socket.io-client';

// Determine server URL (same logic as api.js)
const getServerUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Strip /api suffix to get base server URL
    return envUrl.replace(/\/api$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://api.apexpepco.com';
};

// Singleton socket instance
const socket = io(getServerUrl(), {
  // Only connect when explicitly needed
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  transports: ['websocket', 'polling'],
});

export default socket;
