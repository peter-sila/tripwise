import { useEffect, useState } from 'react';
import { showErrorNotification, showSuccessNotification } from '../utils/notificationUtils';
import './css/TripPlansManagement.css';

const API_BASE = 'http://localhost:8000/api';

const TripPlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Admin authorization required. Please login.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/trip-plans?limit=200&offset=0`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.data) {
        setPlans(data.data);
      } else {
        const message = data.detail || data.error || 'Unable to load trip plans.';
        setError(message);
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to load trip plans:', err);
      const message = 'Unable to load trip plans.';
      setError(message);
      showErrorNotification(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDeletePlan = async (planId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!window.confirm('Delete this trip plan?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/trip-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setPlans((prev) => prev.filter((plan) => plan.id !== planId));
        showSuccessNotification(data.message || 'Trip plan deleted successfully');
      } else {
        const message = data.detail || data.error || 'Unable to delete trip plan.';
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to delete trip plan:', err);
      showErrorNotification('Unable to delete trip plan.');
    }
  };

  return (
    <section className="admin-panel-card admin-trip-plans-card">
      <div className="admin-panel-card-header">
        <div>
          <h2>Trip Plans</h2>
          <p>View and manage trip plans created by users.</p>
        </div>
        <div className="admin-badge-small">Total: {plans.length}</div>
      </div>

      {loading && <div className="admin-panel-empty">Loading trip plans...</div>}
      {error && <div className="admin-panel-error">{error}</div>}

      {!loading && !error && plans.length === 0 && (
        <div className="admin-panel-empty">No trip plans found.</div>
      )}

      {!loading && !error && plans.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>User ID</th>
                <th>Start</th>
                <th>End</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.title}</td>
                  <td>{plan.user_id}</td>
                  <td>{plan.start_date || '—'}</td>
                  <td>{plan.end_date || '—'}</td>
                  <td>{Array.isArray(plan.items) ? plan.items.length : 0}</td>
                  <td>
                    <button className="admin-action-btn danger" onClick={() => handleDeletePlan(plan.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default TripPlansManagement;
