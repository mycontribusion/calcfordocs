import React, { useState, useEffect } from "react";
import usePWAInstall from "../hooks/usePWAInstall";

export default function InstallGuide() {
  const { canInstall, promptInstall, isInstalled, isIOS, isAndroid, isDesktop } =
    usePWAInstall();
  const [visible, setVisible] = useState(false);

  // Show banner only if not installed and there's a reason to show
  useEffect(() => {
    if (!isInstalled && (isIOS || canInstall)) {
      setVisible(true);
    }
  }, [isInstalled, isIOS, canInstall]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "12px 16px",
        maxWidth: "90%",
        width: "400px",
        textAlign: "center",
        fontSize: "0.9rem",
        zIndex: 1000,
      }}
    >
      {isIOS && (
        <p>
          📱 To install CalcForDocs on iOS: tap <strong>Share</strong> →{" "}
          <strong>Add to Home Screen</strong>.
        </p>
      )}

      {isAndroid && canInstall && (
        <div>
          <p>📱 Install CalcForDocs for offline use:</p>
          <button
            onClick={promptInstall}
            style={{
              padding: "6px 12px",
              fontSize: "0.9rem",
              borderRadius: "6px",
              cursor: "pointer",
              border: "none",
              background: "#4a90e2",
              color: "#fff",
              marginTop: "6px",
            }}
          >
            Install App
          </button>
        </div>
      )}

      {isDesktop && canInstall && (
        <div>
          <p>💻 Install CalcForDocs to open in its own window:</p>
          <button
            onClick={promptInstall}
            style={{
              padding: "6px 12px",
              fontSize: "0.9rem",
              borderRadius: "6px",
              cursor: "pointer",
              border: "none",
              background: "#4a90e2",
              color: "#fff",
              marginTop: "6px",
            }}
          >
            Install App
          </button>
        </div>
      )}

      {!isIOS && !canInstall && (
        <p>🌐 You can bookmark this page for quick access.</p>
      )}

      <button
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: "4px",
          right: "6px",
          background: "transparent",
          border: "none",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}