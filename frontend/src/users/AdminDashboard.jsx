import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

function AdminDashboard() {
  const { language } = useLanguage();

  return (
    <main className="admin-dashboard container">
      <h1>{getTranslation('adminDashboard', language) || 'Admin Dashboard'}</h1>
      <p>{getTranslation('adminDashboardWelcome', language) || 'Welcome to the admin dashboard. This area is restricted to administrators.'}</p>
    </main>
  );
}

export default AdminDashboard;
