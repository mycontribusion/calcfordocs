// components/UpdateBanner.jsx
export default function UpdateBanner({ show, waitingSW, handleUpdateNow, refreshApp, onClose }) {
    if (!show) return null;
  
    return (
      <div className="update-banner">
        <p><strong>Update Available!</strong> New features are ready.</p>
        <div className="update-btns">
          {waitingSW ? (
            <button onClick={handleUpdateNow}>Update</button>
          ) : (
            <button onClick={refreshApp}>Refresh</button>
          )}
          <button onClick={onClose}>Later</button>
        </div>
      </div>
    );
  }