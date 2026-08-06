import { useState } from 'react';
import AdminNavbar from './AdminNavbar.jsx';
import AdminSidebar from './AdminSidebar.jsx';
import AdminOverview from './AdminOverview.jsx';
import UsersManagement from './UsersManagement.jsx';
import TripPlansManagement from './TripPlansManagement.jsx';
import ReviewsManagement from './ReviewsManagement.jsx';
import ContactMessages from './ContactMessages.jsx';
import DestinationManagement from './DestinationManagement.jsx';
import './css/admin.css';
import './css/AdminDashboard.css';
const ADMIN_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'trip-plans', label: 'Trip Plans' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'messages', label: 'Contact Messages' },
  { id: 'destinations', label: 'Destinations' }
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-dashboard-page admin-dashboard-page-enter">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="admin-dashboard-header">
        <div>
          <p className="admin-badge">Admin Console</p>
          <h1>Management Dashboard</h1>
          <p className="admin-intro">View site statistics and manage users, trip plans, reviews, messages, and destinations.</p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <AdminSidebar tabs={ADMIN_TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="admin-dashboard-content">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'trip-plans' && <TripPlansManagement />}
          {activeTab === 'reviews' && <ReviewsManagement />}
          {activeTab === 'messages' && <ContactMessages />}
          {activeTab === 'destinations' && <DestinationManagement />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
