import React from "react";
import "./style.css";

const EmailModal = ({ open, onClose, email }) => {
  if (!open || !email) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-2">Email Preview</h2>
        <div className="text-sm text-gray-500 mb-4">
          <strong>Email ID:</strong> {email.id}
        </div>
        <div className="text-gray-800 whitespace-pre-wrap">{email.body}</div>
      </div>
    </div>
  );
};

export default EmailModal;
