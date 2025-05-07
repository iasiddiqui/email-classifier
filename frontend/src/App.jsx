import React from 'react';
import Login from './components/Login';
import EmailList from './components/EmailList';

const App = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  return token ? <EmailList token={token} /> : <Login />;
};

export default App;
