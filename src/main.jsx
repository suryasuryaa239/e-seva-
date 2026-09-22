import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Production Cloud API Base URL (Render.com Express Backend)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://e-seva-portal-iyau.onrender.com' : '');

if (API_BASE_URL) {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    if (typeof input === 'string') {
      if (input.startsWith('/api/') || input.startsWith('/uploads/')) {
        input = `${API_BASE_URL}${input}`;
      }
    } else if (input && typeof input.url === 'string') {
      const url = input.url;
      if (url.startsWith('/api/') || url.startsWith('/uploads/')) {
        input = new Request(`${API_BASE_URL}${url}`, input);
      }
    }
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

