import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import EmailList from './components/EmailList';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const [userRes, tokenRes] = await Promise.all([
          axios.get(`${backendURL}/auth/user`, { withCredentials: true }),
          axios.get(`${backendURL}/auth/token`, { withCredentials: true }),
        ]);
        setUser(userRes.data);
        setToken(tokenRes.data.accessToken);
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
      fetchSessionData();
    }
  }, []);

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
