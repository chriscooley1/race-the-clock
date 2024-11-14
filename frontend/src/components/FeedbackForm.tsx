import React, { useState } from "react";
import axios from "axios";

const FeedbackForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/feedback", { user_email: email, message, page_url: window.location.href });
            setSuccess(true);
            setEmail("");
            setMessage("");
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <div>
            <h2>Feedback</h2>
            {success && <p>Thank you for your feedback!</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                    placeholder="Your feedback"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Submit Feedback</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
