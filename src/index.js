import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

function Root() {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  // Called when a new SW is waiting
  const onSWUpdate = (worker) => {
    setWaitingWorker(worker);
    setShowUpdate(true);
  };

  const refreshApp = () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowUpdate(false);
    window.location.reload();
  };

  serviceWorkerRegistration.register(onSWUpdate);

  return (
    <>
      <App />
      {showUpdate && (
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
            zIndex: 9999,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <span>New version available.</span>
          <button
            style={{
              marginLeft: "1rem",
              padding: "0.3rem 0.6rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={refreshApp}
          >
            Refresh
          </button>
          <button
            style={{
              marginLeft: "0.5rem",
              padding: "0.3rem 0.6rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#fff",
              color: "#dc091e",
            }}
            onClick={() => setShowUpdate(false)}
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
