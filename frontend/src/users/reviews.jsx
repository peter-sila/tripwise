import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Star, ThumbsUp, MessageCircle, User, Calendar, MapPin, Filter } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './css/reviews.css';

const API_BASE = 'http://localhost:8000/backend/api';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      fetchReviews(selectedDestination.id);
    }
  }, [selectedDestination]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE}/destinations.php`);
      const data = await response.json();
      if (data.destinations) {
        setDestinations(data.destinations);
        if (data.destinations.length > 0) {
          setSelectedDestination(data.destinations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const fetchReviews = async (destinationId) => {
    try {
      const response = await fetch(`${API_BASE}/reviews.php?destination_id=${destinationId}`);
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const filteredReviews = sortedReviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating >= parseInt(filterRating);
  });

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const totalReviews = reviews.length;

  return (
    <>
      <Navbar />

      <main className="reviews-page">
        {/* HERO SECTION */}
        <header className="page-header">
          <div className="container">
            <h1>Community Reviews</h1>
            <p>Read authentic experiences from travelers like you</p>
          </div>
        </header>

        {/* STATS SECTION */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{averageRating}</div>
                <div className="stat-label">Average Rating</div>
                <div className="stat-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(averageRating) ? '#f59e0b' : '#e5e7eb'} />
                  ))}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{totalReviews}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">Helpful Votes</div>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS & SORT */}
        <section className="filters-section">
          <div className="container">
            <div className="controls">
              <div className="control-group">
                <label>Select Destination:</label>
                <select value={selectedDestination?.id || ''} onChange={(e) => {
                  const dest = destinations.find(d => d.id == e.target.value);
                  setSelectedDestination(dest);
                }}>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="control-group">
                <label>Filter by rating:</label>
                <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS LIST */}
        <section className="reviews-list-section">
          <div className="container">
            <div className="reviews-list">
              {loading ? (
                <div className="loading-state">
                  <MessageCircle size={48} />
                  <p>Loading reviews...</p>
                </div>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <User size={24} />
                        </div>
                        <div className="reviewer-details">
                          <h3 className="reviewer-name">{review.user_name}</h3>
                        </div>
                      </div>
                      <div className="review-date">
                        <Calendar size={14} /> {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? '#f59e0b' : '#e5e7eb'} />
                      ))}
                    </div>

                    <p className="review-content">{review.comment}</p>

                    <div className="review-actions">
                      <button className="action-btn">
                        <ThumbsUp size={16} /> Helpful
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <MessageCircle size={48} />
                  <p>No reviews found. Try adjusting your filters!</p>
                </div>
              )}
            </div>

            {filteredReviews.length === 0 && (
              <div className="empty-state">
                <MessageCircle size={48} />
                <p>No reviews found. Try adjusting your filters!</p>
              </div>
            )}
          </div>
        </section>

        {/* WRITE REVIEW CTA */}
        <section className="write-review-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Share Your Experience</h2>
              <p>Help other travelers make the best decisions by sharing your honest review</p>
              <button className="cta-button">Write a Review</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Reviews;