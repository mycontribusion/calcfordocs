import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CRA service worker registration
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register CRA service worker for full offline support
serviceWorkerRegistration.register();

// Optional: request persistent storage so browser doesn't evict cache
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    console.log(
      granted
        ? "CalcforDocs storage is persistent"
        : "Storage may be cleared under pressure"
    );
  });
}
