// components/Modal.jsx
export default function Modal({ show, onClose, title, children }) {
    if (!show) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <span className="modal-title">{title}</span>
            <button className="modal-close-btn" onClick={onClose}>
              ✖ Close
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }