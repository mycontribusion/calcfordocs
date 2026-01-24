import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

// This callback fires when a new version is downloaded and waiting to activate
const onUpdateFound = (registration) => {
  const event = new CustomEvent('swUpdateAvailable', { 
    detail: { waiting: registration.waiting } 
  });
  window.dispatchEvent(event);
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker with the update callback
serviceWorkerRegistration.register({ onUpdate: onUpdateFound });