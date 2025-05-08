import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const EmailList = ({ token, user, onLogout }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      const res = await axios.post("http://localhost:5000/emails/fetch", {
        accessToken,
        count: 15,
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
      const res = await axios.get(`http://localhost:5000/emails/${id}`, {
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
                  <div>📝 {email.subject}</div>
                  <div>📂 {email.category}</div>
                </div>
                <p className="email-snippet">{email.snippet}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
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
