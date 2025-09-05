// Feedback.js
import "./calculator.css";

function Feedback() {
  return (
    <div className="calculator">
      <h2>Feedback & Support</h2>
      <p>
        Have suggestions, found a bug, or want to request a new calculator?  
        We’d love to hear from you!
      </p>
      <p>
        📧 Email:{" "}
        <a href="mailto:ahmadmusa1114@gmail.com">
          ahmadmusa1114@gmail.com
        </a>
      </p>

      <form
        action="mailto:ahmadmusa1114@gmail.com"
        method="POST"
        encType="text/plain"
      >
        <label>Your Message</label>
        <textarea
          name="message"
          rows="4"
          placeholder="Type your feedback here..."
          required
        ></textarea>
        <button type="submit">Send Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;
