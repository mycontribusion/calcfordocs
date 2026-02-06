// components/UpdateBanner.jsx
export default function UpdateBanner({ show, onUpdate, onClose }) {
  if (!show) return null;

  return (
    <div style={{display:"none"}} className="update-banner">
      <p><strong>Update Available!</strong> New features are ready.</p>
      <div className="update-btns">
        <button onClick={onUpdate}>Update Now</button>
        <button onClick={onClose}>Later</button>
      </div>
    </div>
  );
}