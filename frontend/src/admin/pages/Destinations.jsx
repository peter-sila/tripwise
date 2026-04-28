import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';

export default function Destinations() {
  const [destinations, setDestinations] = useState([
    { id: 1, name: 'Paris', category: 'Culture', reviews: 45, status: 'active' },
    { id: 2, name: 'Tokyo', category: 'Adventure', reviews: 38, status: 'active' },
    { id: 3, name: 'New York', category: 'Culture', reviews: 52, status: 'active' },
  ]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Destinations</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage travel destinations and locations.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="admin-card-title">All Destinations</p>
            <p className="admin-card-subtitle">Total: {destinations.length} destinations</p>
          </div>
          <button className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add Destination
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Reviews</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map(dest => (
              <tr key={dest.id}>
                <td><MapPin size={14} style={{ display: 'inline', marginRight: '8px' }} />{dest.name}</td>
                <td>{dest.category}</td>
                <td>{dest.reviews}</td>
                <td>
                  <span className="admin-badge admin-badge-success">{dest.status}</span>
                </td>
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
