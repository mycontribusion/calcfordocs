import { useState } from "react";
import "./Feedback.css";

function Feedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailtoLink = `mailto:ahmadmusa1114@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="feedback-container">
      <h2>Feedback & Support</h2>
      <p className="feedback-intro">
        💡 Found a bug? Have suggestions? Share your thoughts below.
      </p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <label>Subject (optional)</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject (optional)"
        />

        <label>Your Message</label>
        <textarea
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your feedback here..."
          required
        ></textarea>

        <button type="submit">📨 Send Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;
