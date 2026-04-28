import React, { useState } from 'react';
import { Edit2, Trash2, Star } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([
    { id: 1, destination: 'Paris', author: 'John', rating: 5, comment: 'Amazing trip!', date: '2024-04-15' },
    { id: 2, destination: 'Tokyo', author: 'Jane', rating: 4, comment: 'Great experience', date: '2024-04-10' },
    { id: 3, destination: 'New York', author: 'Bob', rating: 5, comment: 'Fantastic!', date: '2024-04-05' },
  ]);

  const renderStars = (rating) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          style={{
            fill: i < rating ? '#f59e0b' : '#e5e7eb',
            color: i < rating ? '#f59e0b' : '#e5e7eb'
          }}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Reviews</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage user reviews and ratings.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="admin-card-title">All Reviews</p>
            <p className="admin-card-subtitle">Total: {reviews.length} reviews</p>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{review.destination}</td>
                <td>{review.author}</td>
                <td>{renderStars(review.rating)}</td>
                <td>{review.comment}</td>
                <td>{review.date}</td>
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
