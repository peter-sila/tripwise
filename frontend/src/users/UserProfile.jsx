import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, LogOut, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './css/userprofile.css';

const API_BASE = 'http://localhost:8000/api';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  async function loadUserProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // In a real app, you'd have a /api/profile endpoint
      // For now, we'll get user info from localStorage if available
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          name: userData.name
        }));
      } else {
        // Fallback: create a basic user object from token
        setUser({ id: token, name: 'User', email: 'user@example.com' });
        setFormData(prev => ({
          ...prev,
          name: 'User'
        }));
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    loadUserProfile();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // Validate form
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }

      // If changing password, validate
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setError('Current password is required to change password');
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('New password must be at least 6 characters');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
      }

      // Make API call to update profile
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local storage
        const updatedUser = {
          ...user,
          name: formData.name
        };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));

        setSuccess('Profile updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setEditMode(false);
      } else {
        setError(data.detail || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="profile-title">My Profile</h1>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="profile-name-display">{user?.name || 'User'}</h2>
            <p className="profile-email-display">{user?.email || 'email@example.com'}</p>
          </div>

          {/* Error/Success Messages */}
          {error && <div className="profile-alert profile-alert-error">{error}</div>}
          {success && <div className="profile-alert profile-alert-success">{success}</div>}

          {/* Form Section */}
          <form onSubmit={handleUpdateProfile} className="profile-form">
            {/* Read-only Fields */}
            {!editMode && (
              <div className="profile-info-display">
                <div className="profile-info-item">
                  <span className="profile-info-label">
                    <User size={18} />
                    Name
                  </span>
                  <span className="profile-info-value">{user?.name}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">
                    <Mail size={18} />
                    Email
                  </span>
                  <span className="profile-info-value">{user?.email}</span>
                </div>

                <button
                  type="button"
                  className="profile-btn profile-btn-primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* Edit Mode */}
            {editMode && (
              <div className="profile-form-fields">
                {/* Name Field */}
                <div className="profile-form-group">
                  <label className="profile-label">
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="profile-form-group">
                  <label className="profile-label">
                    <Mail size={18} />
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="profile-input profile-input-disabled"
                    disabled
                  />
                </div>

                {/* Divider */}
                <div className="profile-divider"></div>

                {/* Change Password Section */}
                <h3 className="profile-section-title">Change Password</h3>

                {/* Current Password */}
                <div className="profile-form-group">
                  <label className="profile-label">
                    <Lock size={18} />
                    Current Password
                  </label>
                  <div className="profile-password-input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="Enter current password (optional)"
                    />
                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="profile-form-group">
                  <label className="profile-label">
                    <Lock size={18} />
                    New Password
                  </label>
                  <div className="profile-password-input-group">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="Enter new password (optional)"
                    />
                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="profile-form-group">
                  <label className="profile-label">
                    <Lock size={18} />
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Confirm new password"
                  />
                </div>

                {/* Form Buttons */}
                <div className="profile-form-buttons">
                  <button
                    type="submit"
                    className="profile-btn profile-btn-save"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="profile-btn profile-btn-cancel"
                    onClick={() => {
                      setEditMode(false);
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                      setError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Logout Button */}
          <div className="profile-footer">
            <button
              className="profile-btn profile-btn-logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
