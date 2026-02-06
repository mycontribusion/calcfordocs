export default function UpdateBanner({ show, handleUpdateNow, onClose }) {
  if (!show) return null;

  return (
    <div className="update-banner">
      <p><strong>Update Available!</strong> New features are ready.</p>
      <div className="update-btns">
        <button onClick={handleUpdateNow}>Update Now</button>
        <button onClick={onClose}>Later</button>
      </div>
    </div>
  );
}