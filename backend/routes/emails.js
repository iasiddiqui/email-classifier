import express from "express";
import axios from "axios";
import { classifyEmails } from "../utils/classifyEmails.js";

const router = express.Router();

// POST /emails/fetch - Fetch latest emails and classify them
router.post("/fetch", async (req, res) => {
  const { accessToken, count = 15 } = req.body;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  if (!openaiKey) {
    console.error("❌ Missing OpenAI API key in environment!");
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  try {
    const listResponse = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${count}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const messages = await Promise.all(
      (listResponse.data.messages || []).map(async ({ id }) => {
        const detailRes = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const headers = detailRes.data.payload?.headers || [];
        const fromHeader = headers.find((h) => h.name === "From");
        const subjectHeader = headers.find((h) => h.name === "Subject");

        return {
          id,
          snippet: detailRes.data.snippet,
          from: fromHeader?.value || "Unknown Sender",
          subject: subjectHeader?.value || "No Subject",
        };
      })
    );

    const classified = await classifyEmails(messages, openaiKey);
    res.json({ messages: classified });
  } catch (error) {
    console.error("❌ Email fetch/classification failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch or classify emails",
      details: error.message,
    });
  }
});

// GET /emails/:id - Fetch full email content (plain text or HTML)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { accessToken } = req.query;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  try {
    const { data: message } = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const payload = message.payload;
    let body = "No content available";

    const decodeBase64 = (str) => Buffer.from(str, "base64").toString("utf-8");

    // Traverse payload to extract HTML or plain text
    const extractBody = (part) => {
      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
      if (part.parts) {
        for (const p of part.parts) {
          const extracted = extractBody(p);
          if (extracted) return extracted;
        }
      }
      return null;
    };

    const extracted = extractBody(payload);
    if (extracted) body = extracted;

    res.json({
      id: message.id,
      snippet: message.snippet,
      from: message.payload.headers.find(h => h.name === "From")?.value || "Unknown Sender",
      subject: message.payload.headers.find(h => h.name === "Subject")?.value || "No Subject",
      body,
    });
  } catch (error) {
    console.error("❌ Failed to fetch email content:", error.message);
    res.status(500).json({
      error: "Failed to fetch email by ID",
      details: error.message,
    });
  }
});

export default router;
