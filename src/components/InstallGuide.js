export default function InstallGuide({ canInstall, isIOS, isAndroid, isDesktop, onInstall }) {
  return (
    <div className="install-dropdown">
      {isIOS && (
        <p>
          📱 Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> to install on iOS.
        </p>
      )}

      {isAndroid && (
        <div>
          {canInstall ? (
            <button className="install-btn" onClick={onInstall}>
              Install App
            </button>
          ) : (
            <p>📱 Use browser menu → Add to Home Screen.</p>
          )}
        </div>
      )}

      {isDesktop && (
        <div>
          {canInstall ? (
            <button className="install-btn" onClick={onInstall}>
              Install App
            </button>
          ) : (
            <p>💻 Use browser menu → Install / Add to Desktop or bookmark.</p>
          )}
        </div>
      )}
    </div>
  );
}