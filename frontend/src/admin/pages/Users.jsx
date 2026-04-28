import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'inactive', joined: '2024-03-10' },
  ]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Users</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage and view all users on your platform.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="admin-card-title">All Users</p>
            <p className="admin-card-subtitle">Total: {users.length} users</p>
          </div>
          <button className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add User
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin-badge admin-badge-${user.status === 'active' ? 'success' : 'danger'}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joined}</td>
                <td>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" style={{ marginRight: '8px' }}>
                    <Edit2 size={14} />
                  </button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
