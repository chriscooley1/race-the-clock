import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser, submitFeedback } from "../api";

const FeedbackForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div ref={modalRef} className="w-full max-w-md rounded-lg border border-black bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Feedback</h2>
        {success ? (
          <p className="text-green-600">Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              ref={textareaRef}
              className="w-full rounded border border-black p-2 text-gray-800"
              placeholder="Your feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              onKeyDown={handleKeyDown}
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-black bg-gray-200 px-4 py-2 text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded border border-black bg-blue-500 px-4 py-2 text-white"
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
