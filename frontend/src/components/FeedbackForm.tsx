import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser, submitFeedback } from "../api";

const FeedbackForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let displayName = "Anonymous User";

      if (isAuthenticated) {
        try {
          const userProfile = await getCurrentUser(getAccessTokenSilently);
          displayName =
            userProfile?.display_name || user?.name || "Anonymous User";
        } catch (error) {
          console.warn(
            "Could not get user profile, using Anonymous User",
            error,
          );
        }
      }

      await submitFeedback(message, displayName, getAccessTokenSilently);

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Feedback</h2>
        {success ? (
          <p className="text-green-600">Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full rounded border p-2 text-gray-800"
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
                className="rounded bg-gray-200 px-4 py-2 text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white"
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
