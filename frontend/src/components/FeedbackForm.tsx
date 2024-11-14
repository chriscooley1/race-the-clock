import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const FeedbackForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            await axios.post(`${API_BASE_URL}/api/feedback`, {
                message: message,
                page_url: window.location.href
            });
            
            setSuccess(true);
            setMessage("");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setError("Failed to submit feedback. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Feedback</h2>
                {success ? (
                    <p className="text-green-600">Thank you for your feedback!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            className="w-full p-2 border rounded text-gray-800"
                            placeholder="Your feedback"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 rounded text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackForm;
