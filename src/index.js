import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// State to manage update banner
const root = ReactDOM.createRoot(document.getElementById("root"));

function renderApp(updateAvailable = false, onRefresh = null) {
  root.render(
    <React.StrictMode>
      <App />
      {updateAvailable && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#dc091e",
            color: "white",
            padding: "1rem",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <span>New version available!</span>
          <button
            style={{
              marginLeft: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "white",
              color: "#dc091e",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={onRefresh}
          >
            Refresh
          </button>
        </div>
      )}
    </React.StrictMode>
  );
}

// Initial render
renderApp(false);

// Register service worker and handle updates
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingWorker = registration.waiting;
    if (waitingWorker) {
      const refreshApp = () => {
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      };
      renderApp(true, refreshApp);
    }
  },
});
