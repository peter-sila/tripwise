import { useEffect, useState } from 'react';
import { showErrorNotification, showSuccessNotification } from '../utils/notificationUtils';
import './css/ReviewsManagement.css';

const API_BASE = 'http://localhost:8000/api';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Admin authorization required. Please login.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/reviews?limit=200&offset=0`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.data) {
        setReviews(data.data);
      } else {
        const message = data.detail || data.error || 'Unable to load reviews.';
        setError(message);
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to load reviews:', err);
      const message = 'Unable to load reviews.';
      setError(message);
      showErrorNotification(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!window.confirm('Delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        showSuccessNotification(data.message || 'Review deleted successfully');
      } else {
        const message = data.detail || data.error || 'Unable to delete review.';
        showErrorNotification(message);
      }
    } catch (err) {
      console.error('Unable to delete review:', err);
      showErrorNotification('Unable to delete review.');
    }
  };

  return (
    <section className="admin-panel-card admin-reviews-card">
      <div className="admin-panel-card-header">
        <div>
          <h2>Reviews</h2>
          <p>Review and moderate user-submitted reviews.</p>
        </div>
        <div className="admin-badge-small">Total: {reviews.length}</div>
      </div>

      {loading && <div className="admin-panel-empty">Loading reviews...</div>}
      {error && <div className="admin-panel-error">{error}</div>}

      {!loading && !error && reviews.length === 0 && (
        <div className="admin-panel-empty">No reviews found.</div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Destination ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.user_id}</td>
                  <td>{review.destination_id}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment || '—'}</td>
                  <td>
                    <button className="admin-action-btn danger" onClick={() => handleDeleteReview(review.id)}>
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

export default ReviewsManagement;
