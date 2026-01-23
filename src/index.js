import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 1. Define the callback function to handle updates
const onUpdateFound = (registration) => {
  // This creates a custom event that CalcForDocs.jsx listens for
  const event = new CustomEvent('swUpdateAvailable', { detail: registration });
  window.dispatchEvent(event);
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 2. Pass the callback into the register function
serviceWorkerRegistration.register({ onUpdate: onUpdateFound });