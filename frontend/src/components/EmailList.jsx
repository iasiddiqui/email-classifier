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
        accessToken: accessToken,
        count: 15,
        openaiKey: key,
      });

      setEmails(res.data.messages);
    } catch (error) {
      console.error('Error fetching emails:', error);
      alert('Failed to fetch emails. Check the console for more details.');
    }
  };

  return (
    <div className="p-6">
      <input
        className="border px-2 py-1 mr-2"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter OpenAI API Key"
      />
      <button onClick={() => fetchEmails(token)} className="bg-green-600 text-white px-4 py-1 rounded">
        Fetch Emails
      </button>

      <ul className="mt-4">
        {emails.map((email, index) => (
          <li key={index} className="border-b py-2">
            <strong>{email.category}</strong>: {email.snippet}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
