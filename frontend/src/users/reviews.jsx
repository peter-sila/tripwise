import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Star, ThumbsUp, MessageCircle, User, Calendar, MapPin, Filter } from 'lucide-react';
import React, { useState } from 'react';
import './css/reviews.css';

const reviews = [
  {
    id: 1,
    author: 'Sarah Johnson',
    location: 'Nairobi, Kenya',
    destination: 'Serena Safari Lodge',
    rating: 5,
    date: '2 weeks ago',
    image: 'https://i.pravatar.cc/150?img=1',
    title: 'Incredible Safari Experience!',
    content: 'The wildlife viewing was absolutely breathtaking. The guides were knowledgeable and the accommodations were luxurious. Definitely worth every penny!',
    helpful: 234,
    images: 1,
  },
  {
    id: 2,
    author: 'Michael Chen',
    location: 'Singapore',
    destination: 'Hell\'s Gate National Park',
    rating: 4,
    date: '1 month ago',
    image: 'https://i.pravatar.cc/150?img=2',
    title: 'Amazing Adventure',
    content: 'Great place for hiking and rock climbing. The scenery is stunning. Would recommend bringing plenty of water and sun protection.',
    helpful: 156,
    images: 3,
  },
  {
    id: 3,
    author: 'Emma Williams',
    location: 'London, UK',
    destination: 'Lamu Old Town',
    rating: 5,
    date: '3 weeks ago',
    image: 'https://i.pravatar.cc/150?img=3',
    title: 'Perfect Romantic Getaway',
    content: 'The narrow streets, historic buildings, and sunset walks on the beach created such a romantic atmosphere. Local food was delicious!',
    helpful: 198,
    images: 5,
  },
  {
    id: 4,
    author: 'James Rodriguez',
    location: 'New York, USA',
    destination: 'Masai Market',
    rating: 4,
    date: '1 week ago',
    image: 'https://i.pravatar.cc/150?img=4',
    title: 'Vibrant Cultural Experience',
    content: 'Authentic market with amazing crafts and artifacts. Great for shopping and experiencing local culture. Prices are negotiable.',
    helpful: 142,
    images: 2,
  },
  {
    id: 5,
    author: 'Lisa Martinez',
    location: 'Barcelona, Spain',
    destination: 'Nairobi National Museum',
    rating: 4,
    date: '2 weeks ago',
    image: 'https://i.pravatar.cc/150?img=5',
    title: 'Informative and Well-Curated',
    content: 'Excellent museum with interesting exhibits about Kenyan history and culture. The staff is very helpful and friendly.',
    helpful: 89,
    images: 0,
  },
];

function Reviews() {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const filteredReviews = sortedReviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating === parseInt(filterRating);
  });

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
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
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
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
              {filteredReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={review.image} alt={review.author} className="reviewer-avatar" />
                      <div className="reviewer-details">
                        <h3 className="reviewer-name">{review.author}</h3>
                        <p className="reviewer-location">
                          <MapPin size={14} /> {review.location}
                        </p>
                      </div>
                    </div>
                    <div className="review-date">
                      <Calendar size={14} /> {review.date}
                    </div>
                  </div>

                  <div className="review-destination">
                    <span className="dest-badge">{review.destination}</span>
                  </div>

                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? '#f59e0b' : '#e5e7eb'} />
                    ))}
                  </div>

                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-content">{review.content}</p>

                  {review.images > 0 && (
                    <div className="review-images">
                      <span>{review.images} photos</span>
                    </div>
                  )}

                  <div className="review-actions">
                    <button className="action-btn">
                      <ThumbsUp size={16} /> Helpful ({review.helpful})
                    </button>
                    <button className="action-btn">
                      <MessageCircle size={16} /> Reply
                    </button>
                  </div>
                </div>
              ))}
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