import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

function Root() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: () => setUpdateAvailable(true),
    });
  }, []);

  return (
    <>
      <App />
      {updateAvailable && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>A new version is available.</span>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginLeft: '10px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
          <button
            onClick={() => setUpdateAvailable(false)}
            style={{
              marginLeft: '10px',
              background: '#888',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
