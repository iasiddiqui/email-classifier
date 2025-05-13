# 📧 MagicSlides Email Classifier

This is a full-stack web application that authenticates users via Google, fetches their Gmail messages, and classifies emails into categories using OpenAI's GPT model (`gpt-4o`).

---

## 🌐 Tech Stack

### 🔧 Backend (Node.js + Express):
- **Express** – REST API server
- **Passport + passport-google-oauth20** – Google OAuth login
- **express-session** – Session-based auth
- **axios** – HTTP requests to Gmail API
- **dotenv** – Secure environment variable handling
- **@langchain/openai** – Integrate with OpenAI (GPT-4o) for email classification

### ⚛️ Frontend (React + Vite):
- **React 19** – Frontend UI
- **axios** – Client API calls
- **Vite** – Fast dev/build tool
- **Tailwind CSS** – Styling
- **React Router DOM** – Routing (optional)

---

## ⚙️ Features

- 🔐 Google OAuth2 login
- 📥 Gmail Read-only access
- 📃 Email listing with sender, subject, and preview
- 🧠 Classify emails into categories:
  - Important
  - Promotions
  - Social
  - Marketing
  - Spam
  - General
- 📬 Full email preview
- 🧠 AI classification using OpenAI GPT-4o
- 🧠 Session persistence using cookies

---

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/email-classifier.git
cd email-classifier


```
## 🛠️ ENV Setup

## Frontend
```bash

VITE_GOOGLE_CLIENT_ID=your_VITE_GOOGLE_CLIENT_ID
VITE_GOOGLE_CLIENT_SECRET=your_VITE_GOOGLE_CLIENT_SECRET
VITE_BACKEND_URL=http://localhost:5000
VITE_CLIENT_URL=http://localhost:5173
```
## Backend
```bash
GOOGLE_CLIENT_ID=your_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=your_GOOGLE_CLIENT_SECRET
SESSION_SECRET=your_SESSION_SECRET
OPENAI_API_KEY=sk-your_OPENAI_API_KEY
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
PORT=5000
```
## Google OAuth Setup

- Go to Google [Cloud Console](https://console.cloud.google.com/welcome/new?pli=1&inv=1&invt=AbxTnQ)
- Create a project
- Enable Gmail API and OAuth consent screen
- Create OAuth Credentials
- Redirect URI: http://localhost:5000/auth/google/callback
- Use the generated credentials in your .env


