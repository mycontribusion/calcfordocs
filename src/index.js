import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Main() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  // Listen for messages from the service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "NEW_VERSION") {
          setWaitingWorker(event.data.payload);
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  // User clicks "Refresh" → skip waiting & reload
  const refreshApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };

  // User clicks "Dismiss" → hide banner
  const dismissBanner = () => {
    setUpdateAvailable(false);
  };

  return (
    <>
      <App />

      {/* Update banner */}
      {updateAvailable && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#dc091e",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 9999,
            maxWidth: "300px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>
            A new version is available!
          </p>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={refreshApp}
              style={{
                flex: 1,
                padding: "0.5rem",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#fff",
                color: "#dc091e",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
            <button
              onClick={dismissBanner}
              style={{
                flex: 1,
                padding: "0.5rem",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#fff",
                color: "#555",
                cursor: "pointer",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}

root.render(<Main />);

// Register SW with callback to detect waiting updates
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      // Send the waiting SW to the app via message
      registration.waiting.postMessage({ type: "NEW_VERSION", payload: registration.waiting });
    }
  },
});
