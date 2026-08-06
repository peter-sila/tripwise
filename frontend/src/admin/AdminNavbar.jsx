import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AdminNavbar.css';

const ADMIN_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'trip-plans', label: 'Trip Plans' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'messages', label: 'Messages' },
  { id: 'destinations', label: 'Destinations' }
];

const AdminNavbar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo') || 'null');
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminInfo');
    navigate('/');
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-brand">
        <a onClick={() => navigate('/admin/dashboard')} className="admin-navbar-logo" role="button">
          Tripwise Admin
        </a>
      </div>

      <nav className="admin-navbar-links">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-navbar-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="admin-navbar-actions">
        {user?.name ? <span className="admin-navbar-user">{user.name}</span> : null}
        <button className="admin-navbar-logout" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
