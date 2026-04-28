import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
import '../css/profilemodal.css';

const API_BASE = 'http://localhost:8000/api';

export default function ProfileModal({ isOpen, onClose, user, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);

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
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Validate form
      if (!formData.name.trim()) {
        setError('Name is required');
        setLoading(false);
        return;
      }

      // If changing password, validate
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setError('Current password is required to change password');
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('New password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
      }

      // Make API call to update profile
      const response = await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateProfile',
          token,
          name: formData.name,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local storage
        const updatedUser = {
          ...user,
          name: formData.name
        };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));

        setSuccess('Profile updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setEditMode(false);
        
        // Close modal after success
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="profile-modal-backdrop" onClick={onClose}></div>

      {/* Modal */}
      <div className="profile-modal">
        {/* Modal Header */}
        <div className="profile-modal-header">
          <h2 className="profile-modal-title">My Profile</h2>
          <button 
            className="profile-modal-close"
            onClick={onClose}
            aria-label="Close profile"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="profile-modal-content">
          {/* Avatar Section */}
          <div className="profile-modal-avatar-section">
            <div className="profile-modal-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h3 className="profile-modal-name">{user?.name || 'User'}</h3>
            <p className="profile-modal-email">{user?.email || 'email@example.com'}</p>
          </div>

          {/* Error/Success Messages */}
          {error && <div className="profile-modal-alert profile-modal-alert-error">{error}</div>}
          {success && <div className="profile-modal-alert profile-modal-alert-success">{success}</div>}

          {/* Form Section */}
          <form onSubmit={handleUpdateProfile} className="profile-modal-form">
            {/* Read-only Fields */}
            {!editMode && (
              <div className="profile-modal-info-display">
                <div className="profile-modal-info-item">
                  <span className="profile-modal-info-label">
                    <User size={16} />
                    Name
                  </span>
                  <span className="profile-modal-info-value">{user?.name}</span>
                </div>

                <div className="profile-modal-info-item">
                  <span className="profile-modal-info-label">
                    <Mail size={16} />
                    Email
                  </span>
                  <span className="profile-modal-info-value">{user?.email}</span>
                </div>

                <button
                  type="button"
                  className="profile-modal-btn profile-modal-btn-primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* Edit Mode */}
            {editMode && (
              <div className="profile-modal-form-fields">
                {/* Name Field */}
                <div className="profile-modal-form-group">
                  <label className="profile-modal-label">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="profile-modal-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="profile-modal-form-group">
                  <label className="profile-modal-label">
                    <Mail size={16} />
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="profile-modal-input profile-modal-input-disabled"
                    disabled
                  />
                </div>

                {/* Divider */}
                <div className="profile-modal-divider"></div>

                {/* Change Password Section */}
                <h4 className="profile-modal-section-title">Change Password</h4>

                {/* Current Password */}
                <div className="profile-modal-form-group">
                  <label className="profile-modal-label">
                    <Lock size={16} />
                    Current Password
                  </label>
                  <div className="profile-modal-password-input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                      placeholder="Enter current password (optional)"
                    />
                    <button
                      type="button"
                      className="profile-modal-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="profile-modal-form-group">
                  <label className="profile-modal-label">
                    <Lock size={16} />
                    New Password
                  </label>
                  <div className="profile-modal-password-input-group">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                      placeholder="Enter new password (optional)"
                    />
                    <button
                      type="button"
                      className="profile-modal-password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="profile-modal-form-group">
                  <label className="profile-modal-label">
                    <Lock size={16} />
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="profile-modal-input"
                    placeholder="Confirm new password"
                  />
                </div>

                {/* Form Buttons */}
                <div className="profile-modal-form-buttons">
                  <button
                    type="submit"
                    className="profile-modal-btn profile-modal-btn-save"
                    disabled={loading}
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="profile-modal-btn profile-modal-btn-cancel"
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
          {!editMode && (
            <div className="profile-modal-footer">
              <button
                className="profile-modal-btn profile-modal-btn-logout"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
