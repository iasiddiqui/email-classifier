import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const EmailList = ({ token, user, onLogout }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [classificationCount, setClassificationCount] = useState(1);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (token) {
      fetchEmails(token);
    }
  }, [token]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  const fetchEmails = async (accessToken) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/emails/fetch`, {
        accessToken,
        count: 30,
      });
      setEmails(res.data.messages);
    } catch (error) {
      console.error("Error fetching emails:", error);
      alert("Failed to fetch emails.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailById = async (id) => {
    try {
      const res = await axios.get(`${backendURL}/emails/${id}`, {
        params: { accessToken: token },
      });
      setSelectedEmail(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch email content:", err);
      alert("Could not load full email.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmail(null);
  };

  const getCategory = (emailId) => {
    const email = emails.find((e) => e.id === emailId);
    return email?.category || null;
  };

  const handleReclassify = async () => {
    const selectedEmails = emails.slice(0, classificationCount);
    try {
      const res = await axios.post(`${backendURL}/emails/fetch`, {
        accessToken: token,
        count: classificationCount,
      });
      setEmails(res.data.messages);
    } catch (err) {
      console.error("Reclassification failed:", err);
      alert("Failed to re-fetch and classify emails.");
    }
  };

  return (
    <div className="email-page">
      <div className="email-header">
        <div className="user-info">
          <span className="user-name">👤 {user?.name || "User"}</span>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout 🔓
        </button>
      </div>

      <div className="email-container">
        <h2 className="email-heading">Your Emails</h2>

        <div className="classification-controls">
          <label htmlFor="count-select">Select number</label>
          <select
            id="count-select"
            value={classificationCount}
            onChange={(e) => setClassificationCount(Number(e.target.value))}
            className="count-dropdown"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button className="classify-button" onClick={handleReclassify}>
            Classify
          </button>
        </div>

        {loading ? (
          <p className="loading-text">📬 Your emails are loading...</p>
        ) : (
          <ul className="email-list">
            {emails.map((email) => (
              <li
                key={email.id}
                className="email-item"
                onClick={() => fetchEmailById(email.id)}
              >
                <div className="email-details">
                  <strong>📧 {email.from}</strong>
                  <p>{email.subject}</p>
                  {getCategory(email.id) && (
                    <span className="email-category">
                      📂 {getCategory(email.id)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && selectedEmail && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedEmail.subject}</h3>
            <p><strong>From:</strong> {selectedEmail.from}</p>
            <div className="modal-body">{selectedEmail.body}</div>
            <button className="close-modal" onClick={closeModal}>
              Close ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailList;
