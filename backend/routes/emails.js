import express from 'express';
import axios from 'axios';
import { classifyEmails } from '../utils/classifyEmails.js';

const router = express.Router();

router.post('/fetch', async (req, res) => {
  const { accessToken, count = 15, openaiKey } = req.body;

  try {
    // Make the Gmail API call to fetch messages
    const response = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${count}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Process email messages
    const messages = await Promise.all(
      response.data.messages.map(async (msg) => {
        const msgDetails = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const snippet = msgDetails.data.snippet || '';
        return { id: msg.id, snippet };
      })
    );

    // Classify emails using OpenAI model
    const categories = await classifyEmails(messages, openaiKey);

    // Send back the classified emails
    res.json({ messages: categories });
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ error: 'Failed to fetch or classify emails', details: error.message });
  }
});

export default router;
