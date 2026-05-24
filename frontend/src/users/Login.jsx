import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function Login() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        if (data.user) localStorage.setItem('userInfo', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.detail || data.message || getTranslation('loginError', language));
      }
    } catch (err) {
      console.error('Login error', err);
      setError(getTranslation('networkError', language) || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page container">
      <h1>{getTranslation('login', language) || 'Login'}</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>{getTranslation('email', language) || 'Email'}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>{getTranslation('password', language) || 'Password'}</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="form-message error">{error}</div>}
        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? getTranslation('loggingIn', language) || 'Logging in...' : getTranslation('login', language) || 'Login'}</button>
        </div>
      </form>
    </main>
  );
}

export default Login;
