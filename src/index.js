import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Register service worker for offline support
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      // Optionally prompt the user
      if (window.confirm("New version available. Refresh to update?")) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    }
  },
  onSuccess: () => {
    console.log("App is ready for offline use.");
  },
});
