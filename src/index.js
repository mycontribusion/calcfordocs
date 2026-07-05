import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
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