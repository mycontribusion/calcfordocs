import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Main() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  // Reload the page to activate the new SW
  const refreshApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setUpdateAvailable(false);
    }
  };

  // Dismiss the banner without refreshing
  const dismissBanner = () => {
    setUpdateAvailable(false);
  };

  return (
    <>
      <App />
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

// Render the app
root.render(<Main />);

// ✅ Register service worker with inline callback — no unused variable
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      // Tell React app to show the update banner
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      // Alternatively, you can manage state via a global event or context
      // For simplicity, the page will reload automatically
      window.location.reload();
    }
  },
});
