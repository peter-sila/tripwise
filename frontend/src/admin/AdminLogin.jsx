import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import './css/admin-login.css';

const API_BASE = 'http://localhost:8000/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        })
      });

      const data = await response.json();

      if (data.message === 'Login successful') {
        const user = data.user;
        
        // Check if user is admin
        if (!user.role || (user.role !== 'admin' && user.role !== 'super_admin')) {
          setError('You do not have admin access. Please use admin credentials.');
          setLoading(false);
          return;
        }

        // Store token and admin info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(user));
        
        // Redirect to dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        {/* Left Side - Branding */}
        <div className="admin-login-branding">
          <div className="admin-logo">
            <div className="logo-icon">TW</div>
            <h1>TripWise Admin</h1>
          </div>
          <p className="admin-tagline">Manage your travel platform with ease</p>
          <div className="admin-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Dashboard & Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>User Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌍</span>
              <span>Destination Control</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <span>System Settings</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="admin-login-form-wrapper">
          <div className="admin-login-form">
            <h2>Admin Login</h2>
            <p className="admin-login-subtitle">Enter your admin credentials to access the panel</p>

            {error && (
              <div className="admin-error-alert">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="password">Password</label>
                <div className="admin-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="admin-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Login to Admin Panel
                  </>
                )}
              </button>
            </form>

            <div className="admin-credentials-hint">
              <p className="text-muted">Note:</p>
              <code>You need admin/super_admin role to access this panel</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
