import React, { useState, useEffect } from 'react';
import AdminNavbar from './statics/AdminNavbar';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import DestinationsPage from './pages/Destinations';
import ReviewsPage from './pages/Reviews';
import TravelTipsPage from './pages/TravelTips';
import ContactsPage from './pages/Contacts';
import SettingsPage from './pages/Settings';
import './css/admin-dashboard.css';

const API_BASE = 'http://localhost:8000/api';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('adminInfo');

    if (!token || !adminData) {
      window.location.href = '/admin/login';
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminData);
      
      // Check if user is admin
      if (!parsedAdmin.role || (parsedAdmin.role !== 'admin' && parsedAdmin.role !== 'super_admin')) {
        window.location.href = '/admin/login';
        return;
      }
      
      setAdminInfo(parsedAdmin);
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin info:', err);
      window.location.href = '/admin/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    window.location.href = '/';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersPage />;
      case 'destinations':
        return <DestinationsPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'travel-tips':
        return <TravelTipsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Navbar with Horizontal Menu */}
      <AdminNavbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        adminInfo={adminInfo}
        onLogout={handleLogout}
      />

      {/* Page Content */}
      <div className="admin-page-content">
        {renderPage()}
      </div>
    </div>
  );
}
