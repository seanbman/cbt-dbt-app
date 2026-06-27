import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './print.css';

const rootTag = document.getElementById('root');

function CrashFallback({ message }) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, color: '#18211f', background: '#f8f5ef', minHeight: '100vh' }}>
      <h1>Steady Steps could not start</h1>
      <p>The app hit a browser runtime error. Refresh the page, or check the browser console for details.</p>
      {message && <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', border: '1px solid #d7ddd9', borderRadius: 12, padding: 16 }}>{message}</pre>}
    </main>
  );
}

try {
  createRoot(rootTag).render(<App />);
} catch (error) {
  createRoot(rootTag).render(<CrashFallback message={error?.message} />);
}

window.addEventListener('error', (event) => {
  const currentRoot = document.getElementById('root');
  if (currentRoot && currentRoot.childElementCount === 0) {
    createRoot(currentRoot).render(<CrashFallback message={event.message} />);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // The app remains fully usable if service-worker registration fails.
    });
  });
}
