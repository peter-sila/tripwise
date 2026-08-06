import { useEffect, useState } from 'react';
import { showErrorNotification } from '../utils/notificationUtils';
import './css/AdminOverview.css';

const API_BASE = 'http://localhost:8000/api';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Admin authorization required. Please login.');
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok && data.data) {
          setStats(data.data);
        } else {
          const message = data.detail || data.error || 'Unable to load admin stats.';
          setError(message);
          showErrorNotification(message);
        }
      } catch (err) {
        console.error('Unable to load admin stats:', err);
        const message = 'Unable to load admin stats.';
        setError(message);
        showErrorNotification(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="admin-panel-card admin-overview-card">
      <div className="admin-panel-card-header">
        <div>
          <h2>Overview</h2>
          <p>Global site usage and resource counts across the application.</p>
        </div>
      </div>

      {loading && <div className="admin-panel-empty">Loading overview...</div>}
      {error && <div className="admin-panel-error">{error}</div>}

      {!loading && !error && stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span>Users</span>
            <strong>{stats.users}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Destinations</span>
            <strong>{stats.destinations}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Trip Plans</span>
            <strong>{stats.trip_plans}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Reviews</span>
            <strong>{stats.reviews}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Contact Messages</span>
            <strong>{stats.contact_messages}</strong>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminOverview;
