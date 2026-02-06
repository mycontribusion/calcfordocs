import { useState } from "react";
import "./Feedback.css";

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
    <div className="feedback-dropdown">
      <p className="feedback-intro">
        💡 Found a bug or have suggestions? Share your thoughts below.
      </p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional)"
        />

        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your feedback here..."
          required
        ></textarea>

        <button type="submit">📨 Send</button>
      </form>
    </div>
  );
}