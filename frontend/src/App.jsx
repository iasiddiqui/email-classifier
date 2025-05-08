import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import EmailList from './components/EmailList';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check session for user and token
    const fetchSessionData = async () => {
      try {
        const [userRes, tokenRes] = await Promise.all([
          axios.get('http://localhost:5000/auth/user', { withCredentials: true }),
          axios.get('http://localhost:5000/auth/token', { withCredentials: true }),
        ]);
  
        setUser(userRes.data);
        setToken(tokenRes.data.accessToken);
  
        // Store in localStorage for refresh
        localStorage.setItem('user', JSON.stringify(userRes.data));
        localStorage.setItem('token', tokenRes.data.accessToken);
      } catch (err) {
        console.error('Session fetch failed:', err);
        logout();
      }
    };
  
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
  
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      fetchSessionData(); // 🔐 Try to fetch from server session
    }
  }, []);
  
  const fetchUserDetails = async (accessToken) => {
    try {
      const res = await axios.get('http://localhost:5000/auth/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true, // This ensures cookies are sent with the request
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      console.error('User fetch failed:', err);
      logout(); // Invalid token
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <Login />;
  }

  return <EmailList token={token} user={user} onLogout={logout} />;
};

export default App;
