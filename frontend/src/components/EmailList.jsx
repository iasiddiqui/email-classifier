import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmailList = ({ token }) => {
  const [emails, setEmails] = useState([]);
  const [key, setKey] = useState(localStorage.getItem('openaiKey') || '');

  useEffect(() => {
    if (token && key) {
      fetchEmails(token);
    }
  }, [token, key]);

  const fetchEmails = async (accessToken) => {
    localStorage.setItem('openaiKey', key);
    try {
      const res = await axios.post('http://localhost:5000/emails/fetch', {
        accessToken,
        count: 15,
        openaiKey: key,
      });
      setEmails(res.data.messages);
    } catch (error) {
      console.error('Error fetching emails:', error);
      alert('Failed to fetch emails.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Emails</h2>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-auto flex-1"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter OpenAI API Key"
          />
          <button
            onClick={() => fetchEmails(token)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
          >
            Fetch Emails
          </button>
        </div>

        <ul className="divide-y divide-gray-200">
          {emails.length > 0 ? (
            emails.map((email, index) => (
              <li key={index} className="py-4">
                <div className="flex flex-col">
                  <span className="text-sm text-indigo-600 font-semibold">{email.category}</span>
                  <p className="text-gray-700 mt-1">{email.snippet}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No emails to display yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EmailList;
