import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import emailRoutes from './routes/emails.js';

dotenv.config();

const app = express();

// CORS configuration (Allow frontend on localhost:5173)
app.use(
  cors({
    origin: 'http://localhost:5173', // Correct for Vite frontend
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/emails', emailRoutes);

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
