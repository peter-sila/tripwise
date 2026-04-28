import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'TripWise',
    siteDescription: 'Travel planning platform',
    maintenanceMode: false,
    emailNotifications: true,
    maxUploadSize: 5,
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Configure your platform settings and preferences.</p>
      </div>

      <div className="admin-card" style={{ maxWidth: '600px' }}>
        <div className="admin-card-header">
          <div>
            <p className="admin-card-title">Platform Settings</p>
            <p className="admin-card-subtitle">Update your site configuration</p>
          </div>
        </div>

        <form className="admin-form">
          <div className="admin-form-group">
            <label>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Max Upload Size (MB)</label>
            <input
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) => handleChange('maxUploadSize', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              />
              Enable Email Notifications
            </label>
          </div>

          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              />
              Maintenance Mode
            </label>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
          >
            <Save size={18} />
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
