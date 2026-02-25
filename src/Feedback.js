import { useState } from "react";
import "./components/Dropdowns.css";

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
    <path d="M12.031 6.172c-2.32 0-4.525 1.232-5.717 3.208-.557.924-.844 1.99-.844 3.09 0 1.238.358 2.454 1.037 3.5l-1.092 3.987 4.085-1.072a7.17 7.17 0 0 0 3.531.917c2.321 0 4.525-1.232 5.717-3.208s1.144-4.32-.424-6.32a7.152 7.152 0 0 0-6.293-3.098v-.004zm0 1.018c1.942 0 3.805 1.03 4.811 2.68 1.31 2.147.962 4.962-1.123 6.643-1.011 1.66-2.874 2.69-4.816 2.69-.971 0-1.928-.246-2.775-.724l-2.39.627.632-2.305a5.137 5.137 0 0 1-.894-2.859c0-1.94 1.031-3.804 2.68-4.81a5.137 5.137 0 0 1 3.875-.94v-.002zm2.67 3.298c-.146-.073-.865-.427-.999-.475s-.232-.073-.329.073-.378.475-.463.573-.17.11-.316.037c-.146-.073-.618-.228-1.178-.727-.435-.389-.728-.868-.813-1.015s-.009-.227.064-.3s.146-.17.219-.256c.073-.085.097-.146.146-.244s.024-.183-.012-.256-.329-.793-.451-1.086c-.12-.288-.242-.248-.332-.253-.085-.005-.183-.005-.281-.005s-.256.037-.39.183c-.134.146-.512.5-.512 1.22s.524 1.415.597 1.512 1.03 1.574 2.508 2.212c.35.15.624.241.838.31.352.112.673.096.926.059.282-.041.865-.354 1.085-.695s.22-.634.152-.756-.25-.183-.396-.256z" />
  </svg>
);

export default function FeedbackDropdown() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `Rating: ${rating || "N/A"}\n\n${message}`;
    const mailtoLink = `mailto:ahmadmusamuhd@gmail.com?subject=${encodeURIComponent(
      subject || "CalcForDocs Feedback"
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const handleWhatsApp = () => {
    const text = `CalcForDocs Feedback%0A%0ARating: ${rating || "N/A"}%0A%0AMessage: ${message || "I have some feedback..."}`;
    window.open(`https://wa.me/2347030061764?text=${text}`, "_blank");
  };

  return (
    <div className="dropdown-container">
      <p className="dropdown-text">
        💡 Found a bug or have suggestions? Share your thoughts below.
      </p>

      <div style={{ marginBottom: 16 }}>
        <p className="dropdown-title" style={{ fontSize: '0.85rem', marginBottom: 8 }}>How's your experience?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['😠', '😐', '😊', '😍'].map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => setRating(idx + 1)}
              style={{
                fontSize: '1.5rem',
                background: rating === idx + 1 ? 'rgba(0,123,255,0.1)' : 'transparent',
                border: rating === idx + 1 ? '1px solid #007bff' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                padding: '4px 8px',
                transition: 'all 0.2s'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="dropdown-input"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional)"
        />

        <textarea
          className="dropdown-textarea"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your feedback here..."
          required
        ></textarea>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="dropdown-btn" style={{ flex: 1 }}>📨 Email</button>
          <button
            type="button"
            className="dropdown-btn"
            onClick={handleWhatsApp}
            style={{ flex: 1, backgroundColor: '#25D366', background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          >
            <WhatsAppIcon /> WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}