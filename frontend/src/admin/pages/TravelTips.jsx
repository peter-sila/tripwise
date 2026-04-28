import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';

export default function TravelTips() {
  const [tips, setTips] = useState([
    { id: 1, title: 'Packing Tips', category: 'Packing', author: 'John', date: '2024-04-15' },
    { id: 2, title: 'Budget Travel', category: 'Budget', author: 'Jane', date: '2024-04-10' },
    { id: 3, title: 'Safety Guide', category: 'Safety', author: 'Bob', date: '2024-04-05' },
  ]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Travel Tips</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage travel tips and advice content.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="admin-card-title">All Travel Tips</p>
            <p className="admin-card-subtitle">Total: {tips.length} tips</p>
          </div>
          <button className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add Tip
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tips.map(tip => (
              <tr key={tip.id}>
                <td><Briefcase size={14} style={{ display: 'inline', marginRight: '8px' }} />{tip.title}</td>
                <td>{tip.category}</td>
                <td>{tip.author}</td>
                <td>{tip.date}</td>
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
