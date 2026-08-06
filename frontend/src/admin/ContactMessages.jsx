import { useEffect, useState } from 'react';
import { showErrorNotification, showSuccessNotification } from '../utils/notificationUtils';
import './css/ContactMessages.css';

const API_BASE = 'http://localhost:8000/api';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Admin authorization required. Please login.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/contact-messages?limit=100&offset=0`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok && data.data) {
        setMessages(data.data);
      } else {
        const message = data.detail || data.error || 'Unable to load contact messages.';
        setError(message);
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to load contact messages:', err);
      const message = 'Unable to load contact messages.';
      setError(message);
      showErrorNotification(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (messageId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!window.confirm('Delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/contact-messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => prev.filter((message) => message.id !== messageId));
        showSuccessNotification(data.message || 'Message deleted successfully');
      } else {
        const message = data.detail || data.error || 'Unable to delete message.';
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to delete message:', err);
      showErrorNotification('Unable to delete message.');
    }
  };

  return (
    <section className="admin-panel-card admin-contact-card">
      <div className="admin-panel-card-header">
        <div>
          <h2>Contact Messages</h2>
          <p>Review incoming feedback, support requests, and user inquiries.</p>
        </div>
        <div className="admin-badge-small">Total: {messages.length}</div>
      </div>

      {loading && <div className="admin-panel-empty">Loading messages...</div>}
      {error && <div className="admin-panel-error">{error}</div>}

      {!loading && !error && messages.length === 0 && (
        <div className="admin-panel-empty">No messages found.</div>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.name || '—'}</td>
                  <td>{message.email || '—'}</td>
                  <td>{message.subject || '—'}</td>
                  <td>{message.phone || '—'}</td>
                  <td>{message.message || '—'}</td>
                  <td>
                    <button className="admin-action-btn danger" onClick={() => handleDeleteMessage(message.id)}>
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

export default ContactMessages;
