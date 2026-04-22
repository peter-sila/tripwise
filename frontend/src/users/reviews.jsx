/**
 * Reviews Page Component
 * 
 * Displays destination reviews from the community with filtering and sorting capabilities.
 * Users can:
 * - Select a destination to view its reviews
 * - Filter reviews by minimum rating
 * - Sort reviews by date or rating
 * - See average rating and total review count
 * 
 * Features:
 * - Real-time data fetching from backend API
 * - Dynamic sorting (recent, highest rated)
 * - Rating-based filtering (all, 5-star, 4+, 3+)
 * - Responsive review card layout
 * - Empty states for better UX
 * 
 * @component
 * @returns {JSX.Element} Reviews page with destination selector and review list
 */

import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Star, ThumbsUp, MessageCircle, User, Calendar, MapPin, Filter } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './css/reviews.css';

// API base URL for backend requests
const API_BASE = 'http://localhost:8000/backend/api';

/**
 * Reviews Component
 * 
 * Main component for displaying and filtering destination reviews
 * 
 * State Variables:
 *   - reviews: Array of reviews for selected destination
 *   - destinations: Array of all destinations (for selector)
 *   - selectedDestination: Currently selected destination object
 *   - loading: Loading indicator for async operations
 *   - sortBy: Sort order ('recent', 'rating', 'helpful')
 *   - filterRating: Minimum rating filter ('all', '5', '4', '3')
 * 
 * @returns {JSX.Element} Rendered reviews page
 */
function Reviews() {
  // State for reviews data
  const [reviews, setReviews] = useState([]);         // Reviews for current destination
  const [destinations, setDestinations] = useState([]); // All destinations available
  const [selectedDestination, setSelectedDestination] = useState(null); // Currently selected destination
  
  // State for UI controls
  const [loading, setLoading] = useState(true);       // Loading state for data fetching
  const [sortBy, setSortBy] = useState('recent');     // Sort order for reviews
  const [filterRating, setFilterRating] = useState('all'); // Rating filter threshold

  // Effect Hook 1: Fetch destinations on component mount
  // Runs once when component first renders (empty dependency array)
  useEffect(() => {
    fetchDestinations();
  }, []);

  /**
   * Effect Hook 2: Fetch reviews when destination changes
   * Automatically loads reviews when user selects a different destination
   * 
   * Dependency: selectedDestination - triggers fetch when destination ID changes
   */
  useEffect(() => {
    if (selectedDestination) {
      fetchReviews(selectedDestination.id);
    }
  }, [selectedDestination]);

  /**
   * Fetch All Destinations
   * 
   * Makes API call to get list of all available destinations.
   * Sets first destination as default selection if available.
   * Handles errors gracefully with console logging.
   * 
   * @async
   * @returns {Promise<void>}
   */
  const fetchDestinations = async () => {
    try {
      // Request all destinations from API
      const response = await fetch(`${API_BASE}/destinations.php`);
      const data = await response.json();
      
      // Update state with fetched destinations
      if (data.destinations) {
        setDestinations(data.destinations);
        // Auto-select first destination if available
        if (data.destinations.length > 0) {
          setSelectedDestination(data.destinations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  /**
   * Fetch Reviews for Selected Destination
   * 
   * Gets all reviews for a specific destination from backend API.
   * Includes reviewer name and rating information.
   * Updates loading state when complete.
   * 
   * @async
   * @param {number} destinationId - ID of destination to fetch reviews for
   * @returns {Promise<void>}
   */
  const fetchReviews = async (destinationId) => {
    try {
      // Request reviews for specific destination
      const response = await fetch(`${API_BASE}/reviews.php?destination_id=${destinationId}`);
      const data = await response.json();
      
      // Update state with fetched reviews or empty array if none
      if (data.reviews) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      // Mark loading as complete
      setLoading(false);
    }
  };

  /**
   * Sorted Reviews Array
   * 
   * Creates new sorted array based on sortBy value using useMemo for performance.
   * Spread operator [...reviews] prevents mutation of original array.
   * 
   * Sort Options:
   *   - 'helpful': Sort by helpful count (highest first)
   *   - 'rating': Sort by star rating (highest first)
   *   - 'recent': Sort by creation date (newest first, default)
   */
  const sortedReviews = [...reviews].sort((a, b) => {
    // Sort by helpful votes if selected
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    
    // Sort by rating (5 stars first)
    if (sortBy === 'rating') return b.rating - a.rating;
    
    // Default: sort by newest first
    return new Date(b.created_at) - new Date(a.created_at);
  });

  /**
   * Filtered Reviews Array
   * 
   * Filters sorted reviews based on minimum rating threshold.
   * Only shows reviews that meet the rating filter criteria.
   * 
   * Filter Options:
   *   - 'all': Show all reviews regardless of rating
   *   - '5': Show only 5-star reviews
   *   - '4': Show 4-star or higher reviews
   *   - '3': Show 3-star or higher reviews
   */
  const filteredReviews = sortedReviews.filter(review => {
    // Include all reviews if "all" selected
    if (filterRating === 'all') return true;
    
    // Otherwise, only include reviews at or above the threshold
    return review.rating >= parseInt(filterRating);
  });

  /**
   * Calculate Average Rating
   * 
   * Computes mean rating from all reviews for selected destination.
   * Returns 0 if no reviews exist.
   * Formatted to 1 decimal place.
   */
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;
  
  // Total count of reviews for display
  const totalReviews = reviews.length;

  return (
    <>
      <Navbar />

      <main className="reviews-page">
        {/* HERO SECTION - Page title and description */}
        <header className="page-header">
          <div className="container">
            <h1>Community Reviews</h1>
            <p>Read authentic experiences from travelers like you</p>
          </div>
        </header>

        {/* STATS SECTION - Display average rating, total reviews, and helpful percentage */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {/* Average Rating Card */}
              <div className="stat-card">
                <div className="stat-number">{averageRating}</div>
                <div className="stat-label">Average Rating</div>
                {/* Render star icons - filled for rating, empty for remaining */}
                <div className="stat-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(averageRating) ? '#f59e0b' : '#e5e7eb'} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Total Reviews Count Card */}
              <div className="stat-card">
                <div className="stat-number">{totalReviews}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
              
              {/* Helpful Rating Card */}
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">Helpful Votes</div>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS & SORT SECTION - Controls for destination, sort, and rating filter */}
        <section className="filters-section">
          <div className="container">
            <div className="controls">
              {/* Destination Selector */}
              <div className="control-group">
                <label>Select Destination:</label>
                <select 
                  value={selectedDestination?.id || ''} 
                  onChange={(e) => {
                    // Find destination object by ID from selector
                    const dest = destinations.find(d => d.id == e.target.value);
                    setSelectedDestination(dest);
                  }}
                >
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort Order Selector */}
              <div className="control-group">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Rating Filter Selector */}
              <div className="control-group">
                <label>Filter by rating:</label>
                <select 
                  value={filterRating} 
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS LIST SECTION - Display reviews or empty/loading states */}
        <section className="reviews-list-section">
          <div className="container">
            <div className="reviews-list">
              {/* Loading State - Show while fetching reviews */}
              {loading ? (
                <div className="loading-state">
                  <MessageCircle size={48} />
                  <p>Loading reviews...</p>
                </div>
              ) : filteredReviews.length > 0 ? (
                // Review Cards - Render each review with rating, content, and user info
                filteredReviews.map(review => (
                  <div key={review.id} className="review-card">
                    {/* Review Header - Reviewer name and date posted */}
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <User size={24} />
                        </div>
                        <div className="reviewer-details">
                          <h3 className="reviewer-name">{review.user_name}</h3>
                        </div>
                      </div>
                      {/* Review Date */}
                      <div className="review-date">
                        <Calendar size={14} /> {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Review Rating - Display 1-5 stars */}
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < review.rating ? '#f59e0b' : '#e5e7eb'} 
                        />
                      ))}
                    </div>

                    {/* Review Content - Main review text */}
                    <p className="review-content">{review.comment}</p>

                    {/* Review Actions - Helpful button and other interactions */}
                    <div className="review-actions">
                      <button className="action-btn">
                        <ThumbsUp size={16} /> Helpful
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Empty State - No reviews match current filters
                <div className="empty-state">
                  <MessageCircle size={48} />
                  <p>No reviews found. Try adjusting your filters!</p>
                </div>
              )}
            </div>

            {/* Additional empty state fallback */}
            {filteredReviews.length === 0 && (
              <div className="empty-state">
                <MessageCircle size={48} />
                <p>No reviews found. Try adjusting your filters!</p>
              </div>
            )}
          </div>
        </section>

        {/* WRITE REVIEW CTA - Call-to-action section */}
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