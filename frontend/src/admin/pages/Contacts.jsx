import React, { useState } from 'react';
import { Edit2, Trash2, Mail } from 'lucide-react';

export default function Contacts() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John', email: 'john@example.com', subject: 'Query', status: 'new', date: '2024-04-15' },
    { id: 2, name: 'Jane', email: 'jane@example.com', subject: 'Support', status: 'read', date: '2024-04-10' },
    { id: 3, name: 'Bob', email: 'bob@example.com', subject: 'Feedback', status: 'responded', date: '2024-04-05' },
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      new: 'admin-badge-primary',
      read: 'admin-badge-warning',
      responded: 'admin-badge-success'
    };
    return `admin-badge ${styles[status] || 'admin-badge-primary'}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Contact Forms</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>View and manage contact form submissions.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="admin-card-title">All Submissions</p>
            <p className="admin-card-subtitle">Total: {contacts.length} submissions</p>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td><Mail size={14} style={{ display: 'inline', marginRight: '8px' }} />{contact.email}</td>
                <td>{contact.subject}</td>
                <td>
                  <span className={getStatusBadge(contact.status)}>
                    {contact.status}
                  </span>
                </td>
                <td>{contact.date}</td>
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
