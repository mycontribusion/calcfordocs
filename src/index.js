import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';

function Root() {
  const [waitingWorker, setWaitingWorker] = React.useState(null);
  const [showUpdateBanner, setShowUpdateBanner] = React.useState(false);

  // Called when a new SW is waiting
  const handleSWUpdate = (registration) => {
    setWaitingWorker(registration.waiting);
    setShowUpdateBanner(true);
  };

  const reloadPage = () => {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setShowUpdateBanner(false);
    window.location.reload();
  };

  const dismissBanner = () => {
    setShowUpdateBanner(false);
  };

  React.useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: handleSWUpdate,
      onSuccess: () => console.log('Service Worker registered successfully.'),
    });
  }, []);

  return (
    <>
      {showUpdateBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#dc091e',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            zIndex: 9999,
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <span>New version available!</span>
          <button
            style={{
              background: '#fff',
              color: '#dc091e',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={reloadPage}
          >
            Refresh
          </button>
          <button
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1px solid #fff',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={dismissBanner}
          >
            Dismiss
          </button>
        </div>
      )}
      <App />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
