import { useEffect, useState } from 'react';
import { showErrorNotification, showSuccessNotification } from '../utils/notificationUtils';
import './css/UsersManagement.css';

const API_BASE = 'http://localhost:8000/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Admin authorization required. Please login.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/users?limit=200&offset=0`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.data) {
        setUsers(data.data);
      } else {
        const message = data.detail || data.error || 'Unable to load users.';
        setError(message);
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to load users:', err);
      const message = 'Unable to load users.';
      setError(message);
      showErrorNotification(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!window.confirm('Delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        showSuccessNotification(data.message || 'User deleted successfully');
      } else {
        const message = data.detail || data.error || 'Unable to delete user.';
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to delete user:', err);
      showErrorNotification('Unable to delete user.');
    }
  };

  return (
    <section className="admin-panel-card admin-users-card">
      <div className="admin-panel-card-header">
        <div>
          <h2>Users</h2>
          <p>Manage application users, roles, and account status.</p>
        </div>
        <div className="admin-badge-small">Total: {users.length}</div>
      </div>

      {loading && <div className="admin-panel-empty">Loading users...</div>}
      {error && <div className="admin-panel-error">{error}</div>}

      {!loading && !error && users.length === 0 && (
        <div className="admin-panel-empty">No users found.</div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.role || 'user'}</td>
                  <td>{user.is_admin ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="admin-action-btn danger" onClick={() => handleDeleteUser(user.id)}>
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

export default UsersManagement;
