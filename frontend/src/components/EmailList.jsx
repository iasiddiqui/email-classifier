import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const EmailList = ({ token, user, onLogout }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [classificationCount, setClassificationCount] = useState();
  const [classifiedEmails, setClassifiedEmails] = useState([]);
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
    } catch (err) 
      console.error("Failed to fetch email :", err);
      alert("Could not load full email.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmail(null);
  };

  const handleClassify = async () => {
    const emailsToClassify = emails.slice(0, classificationCount);
    try {
      const res = await axios.post(`${backendURL}/emails/classify`, {
        accessToken: token,
        emails: emailsToClassify,
      });
      setClassifiedEmails(res.data.classified);
    } catch (err) {
      console.error("Classification failed:", err);
      alert("Failed to classify emails.");
    }
  };

  const getCategory = (emailId) => {
    const classified = classifiedEmails.find((e) => e.id === emailId);
    return classified ? classified.category : null;
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
          <button className="classify-button" onClick={handleClassify}>
            Classify
          </button>
        </div>

        {loading ? (
          <p className="loading-text">📬 Your emails are loading...</p>
        ) : (
          <ul className="email-list">
            {emails.map((email, index) => (
              <li
                key={index}
                className="email-item"
                onClick={() => fetchEmailById(email.id)}
              >
                <div className="email-details">
                  <strong>📧 {email.from}</strong>
                  {getCategory(email.id) && (
                    <div className="email-category">📂 {getCategory(email.id)}</div>
                  )}
                </div>
                <p className="email-snippet">{email.snippet}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && selectedEmail && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="email-details">
              <strong>📧 {selectedEmail.from}</strong>
              <div>📝 {selectedEmail.subject}</div>
            </div>
            <div
              className="email-body"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailList;
