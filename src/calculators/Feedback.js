import "./Feedback.css";

function Feedback() {
  return (
    <div className="feedback-container">
      <h2>Feedback & Support</h2>
      <p className="feedback-intro">
        💡 Found a bug? Have suggestions? Share your thoughts below.  
        We’d love to hear from you!
      </p>

      <form
        action="mailto:ahmadmusa1114@gmail.com"
        method="POST"
        encType="text/plain"
        className="feedback-form"
      >
        <label>Subject (optional)</label>
        <input
          type="text"
          name="subject"
          placeholder="Enter subject (optional)"
        />

        <label>Your Message</label>
        <textarea
          name="message"
          rows="5"
          placeholder="Type your feedback here..."
          required
        ></textarea>

        <button type="submit">📨 Send Feedback</button>
      </form>

      <p className="feedback-email">
        Or email us directly at{" "}
        <a href="mailto:ahmadmusa1114@gmail.com">ahmadmusa1114@gmail.com</a>
      </p>
    </div>
  );
}

export default Feedback;
