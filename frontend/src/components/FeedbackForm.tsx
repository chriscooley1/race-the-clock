import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser, submitFeedback } from "../api";

const FeedbackForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);

      // Create preview URLs
      const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let displayName = "Anonymous User";

      if (isAuthenticated) {
        try {
          const userProfile = await getCurrentUser(getAccessTokenSilently);
          displayName = userProfile?.display_name || user?.name || "Anonymous User";
        } catch (error) {
          console.warn("Could not get user profile, using Anonymous User", error);
        }
      }

      await submitFeedback(message, displayName, getAccessTokenSilently, images);

      setSuccess(true);
      setMessage("");
      setImages([]);
      setImagePreviewUrls([]);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-lg border border-black bg-white p-6"
      >
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
            
            <div className="space-y-2">
              <label
                htmlFor="feedback-image-upload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Images (Optional)
              </label>
              <input
                ref={fileInputRef}
                id="feedback-image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload feedback images"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                aria-controls="feedback-image-upload"
              >
                Add Images
              </button>
              
              {imagePreviewUrls.length > 0 && (
                <div 
                  className="grid grid-cols-2 gap-2"
                  role="list"
                  aria-label="Uploaded images preview"
                >
                  {imagePreviewUrls.map((url, index) => (
                    <div 
                      key={index} 
                      className="relative"
                      role="listitem"
                    >
                      <img
                        src={url}
                        alt={`Preview of uploaded image ${index + 1}`}
                        className="h-24 w-24 rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
