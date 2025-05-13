import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import emailRoutes from './routes/emails.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
    }
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/emails', emailRoutes);

// Root route to fix "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🚀 Email Classifier Backend is running...');
});

// Health check route (optional)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is healthy' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
