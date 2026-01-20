import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// Root component to handle update banner
function Root() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // This function will be called by serviceWorkerRegistration when a new SW is waiting
  const onSWUpdate = (registration) => {
    setUpdateAvailable(true);

    // Optional: you can store registration to call skipWaiting
    // registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  return (
    <>
      <App />
      {updateAvailable && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#dc091e",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span>New version available</span>
          <button
            style={{
              backgroundColor: "#fff",
              color: "#dc091e",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      )}
    </>
  );
}

// Render app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

// Register CRA service worker with update callback
serviceWorkerRegistration.register({
  onUpdate: onSWUpdate,
});
