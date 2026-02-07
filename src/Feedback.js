import { useState } from "react";
import "./components/Dropdowns.css";

export default function FeedbackDropdown() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailtoLink = `mailto:ahmadmusamuhd@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="dropdown-container">
      <p className="dropdown-text">
        💡 Found a bug or have suggestions? Share your thoughts below.
      </p>

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
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your feedback here..."
          required
        ></textarea>

        <button type="submit" className="dropdown-btn">📨 Send</button>
      </form>
    </div>
  );
}