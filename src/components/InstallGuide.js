export default function InstallGuide({ canInstall, isIOS, isAndroid, isDesktop, onInstall }) {
  return (
    <div className="install-dropdown">
      {/* iOS Instructions */}
      {isIOS && (
        <div className="install-steps">
          <p>📱 <strong>iOS Installation Steps:</strong></p>
          <ol>
            <li>Open Safari and visit this page.</li>
            <li>Tap the <strong>Share</strong> button (square with an arrow pointing up).</li>
            <li>Scroll and select <strong>Add to Home Screen</strong>.</li>
            <li>Tap <strong>Add</strong> to install the app on your home screen.</li>
          </ol>
        </div>
      )}

      {/* Android Instructions */}
      {isAndroid && (
        <div className="install-steps">
          <p>🤖 <strong>Android Installation Steps:</strong></p>
          {canInstall ? (
            <button className="install-btn" onClick={onInstall}>
              Install App Now
            </button>
          ) : (
            <ol>
              <li>Open this page in Chrome.</li>
              <li>Tap the browser menu (three dots).</li>
              <li>Select <strong>Add to Home Screen</strong>.</li>
              <li>Confirm to install the app.</li>
            </ol>
          )}
        </div>
      )}

      {/* Desktop Instructions */}
      {isDesktop && (
        <div className="install-steps">
          <p>💻 <strong>Desktop Installation Steps:</strong></p>
          {canInstall ? (
            <button className="install-btn" onClick={onInstall}>
              Install App Now
            </button>
          ) : (
            <ol>
              <li>Open this page in a supported browser (Chrome, Edge, or Safari).</li>
              <li>Click the install icon in the search bar and select <strong>Install App</strong> or <strong>Add to Desktop</strong>.</li>
              <li>If unavailable, you can bookmark the page for quick access.</li>
            </ol>
          )}
        </div>
      )}
    </div>
  );
}