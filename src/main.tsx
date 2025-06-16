import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Simple environment detection
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';



// Correct basename for local vs production
const basename = isDev ? '' : '/ancient-history-trivia-pwa';


// Register service worker only in production
if ('serviceWorker' in navigator && !isDev) {
  window.addEventListener('load', () => {
    const swUrl = '/ancient-history-trivia-pwa/sw.js';
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log('✅ SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('❌ SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}
