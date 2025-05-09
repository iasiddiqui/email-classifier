import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Start OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
  })
);

// Handle callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('🔐 User logged in:', req.user);
    res.redirect(`${process.env.CLIENT_URL}/email`);
  }
);

// Get user info
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    const { displayName, emails, photos } = req.user;
    return res.status(200).json({
      name: displayName,
      email: emails?.[0]?.value,
      photo: photos?.[0]?.value,
    });
  } else {
    return res.status(401).json({ error: 'User not authenticated' });
  }
});

// Get access token
router.get('/token', (req, res) => {
  if (req.isAuthenticated() && req.user?.accessToken) {
    return res.status(200).json({ accessToken: req.user.accessToken });
  } else {
    return res.status(401).json({ error: 'User not authenticated or token missing' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect(process.env.CLIENT_URL);
  });
});

export default router;
