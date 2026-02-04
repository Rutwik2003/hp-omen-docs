import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';

// Declare the global hideOmenLoader function from index.html
declare global {
  interface Window {
    hideOmenLoader?: () => void;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

// Hide the loading screen once React app has mounted
requestAnimationFrame(() => {
  if (window.hideOmenLoader) {
    window.hideOmenLoader();
  }
});
