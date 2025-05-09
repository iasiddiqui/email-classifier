import React from 'react';
import './style.css';

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="login-page">
      <h1 className="app-title">MagicSlides Email Classifier</h1>
      <p className="login-description">Sign in with Google to access and classify your Gmail emails.</p>
      <button className="google-login-btn" onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
