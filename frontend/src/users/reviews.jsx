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
import { Star, ThumbsUp, MessageCircle, User, Calendar, MapPin, Filter, X, AlertCircle, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import './css/reviews.css';

// API base URL for backend requests
const API_BASE = 'http://localhost:8000/api';

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
  const { language } = useLanguage();
  
  // State for reviews data
  const [reviews, setReviews] = useState([]);         // Reviews for current destination
  const [destinations, setDestinations] = useState([]); // All destinations available
  const [selectedDestination, setSelectedDestination] = useState(null); // Currently selected destination
  
  // State for UI controls
  const [loading, setLoading] = useState(true);       // Loading state for data fetching
  const [sortBy, setSortBy] = useState('recent');     // Sort order for reviews
  const [filterRating, setFilterRating] = useState('all'); // Rating filter threshold
  
  // State for review form
  const [showReviewForm, setShowReviewForm] = useState(false);  // Form visibility toggle
  const [formData, setFormData] = useState({ rating: 5, comment: '' }); // Form input data
  const [submitting, setSubmitting] = useState(false);  // Submission loading state
  const [submitMessage, setSubmitMessage] = useState(null); // Success/error message
  const [formErrors, setFormErrors] = useState({}); // Form validation errors
  
  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // User auth status
  const [showLoginForm, setShowLoginForm] = useState(false);  // Show login form modal
  const [loginData, setLoginData] = useState({ email: '', password: '' }); // Login form data
  const [loginError, setLoginError] = useState('');  // Login error message
  const [loginLoading, setLoginLoading] = useState(false);  // Login submission state

  // Sort options with translations
  const sortOptions = [
    { value: 'recent', label: getTranslation('recent', language) },
    { value: 'rating', label: getTranslation('highestRated', language) }
  ];

  // Filter options with translations
  const filterOptions = [
    { value: 'all', label: getTranslation('allRatings', language) },
    { value: '5', label: getTranslation('fiveStars', language) },
    { value: '4', label: getTranslation('fourPlus', language) },
    { value: '3', label: getTranslation('threePlus', language) }
  ];

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
   * Validate Review Form
   * Validates all form fields before submission.
   */
  const validateForm = (data) => {
    const errors = {};
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.rating = getTranslation('ratingRequired', language);
    }
    if (!data.comment || data.comment.trim().length === 0) {
      errors.comment = getTranslation('commentRequired', language);
    }
    if (data.comment && data.comment.trim().length < 10) {
      errors.comment = getTranslation('commentMinLength', language);
    }
    return errors;
  };

  /**
   * Handle Review Form Input Change
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Submit Review to Backend
   */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    if (!selectedDestination) {
      setSubmitMessage({ type: 'error', text: getTranslation('selectDestination', language) });
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitMessage({ type: 'error', text: getTranslation('loginRequired', language) });
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/reviews.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination_id: selectedDestination.id,
          rating: formData.rating,
          comment: formData.comment
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage({ type: 'success', text: getTranslation('reviewSubmitted', language) });
        setFormData({ rating: 5, comment: '' });
        setFormErrors({});
        setShowReviewForm(false);
        
        setTimeout(() => {
          fetchReviews(selectedDestination.id);
          setSubmitMessage(null);
        }, 2000);
      } else {
        setSubmitMessage({ type: 'error', text: data.error || getTranslation('reviewError', language) });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitMessage({ type: 'error', text: getTranslation('networkError', language) });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Close Review Form Modal
   */
  const closeReviewForm = () => {
    setShowReviewForm(false);
    setFormData({ rating: 5, comment: '' });
    setFormErrors({});
    setSubmitMessage(null);
  };

  /**
   * Open Review Form with Auth Check
   * If user not authenticated, show login form instead
   */
  const openReviewForm = () => {
    if (!isAuthenticated) {
      setShowLoginForm(true);
    } else {
      setShowReviewForm(true);
    }
  };

  /**
   * Handle Login Form Input Change
   */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (loginError) setLoginError('');
  };

  /**
   * Handle User Login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      setLoginError(getTranslation('required', language));
      return;
    }
    
    setLoginLoading(true);
    try {
      const response = await fetch(`${API_BASE}auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginData.email,
          password: loginData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Save token and update auth state
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setLoginData({ email: '', password: '' });
        setLoginError('');
        
        // Close login form and open review form
        setShowLoginForm(false);
        setShowReviewForm(true);
      } else {
        setLoginError(data.message || getTranslation('loginError', language));
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(getTranslation('networkError', language));
    } finally {
      setLoginLoading(false);
    }
  };

  /**
   * Close Login Form
   */
  const closeLoginForm = () => {
    setShowLoginForm(false);
    setLoginData({ email: '', password: '' });
    setLoginError('');
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
            <h1>{getTranslation('reviews', language)}</h1>
            <p>{getTranslation('readAuthenticExperiences', language)}</p>
          </div>
        </header>

        {/* STATS SECTION - Display average rating, total reviews, and helpful percentage */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {/* Average Rating Card */}
              <div className="stat-card">
                <div className="stat-number">{averageRating}</div>
                <div className="stat-label">{getTranslation('avgRating', language)}</div>
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
                <div className="stat-label">{getTranslation('reviews', language)}</div>
              </div>
              
              {/* Helpful Rating Card */}
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">{getTranslation('helpful', language)}</div>
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
                <label>{getTranslation('selectDestination', language)}</label>
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
                <label>{getTranslation('sortBy', language)}</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter Selector */}
              <div className="control-group">
                <label>{getTranslation('filterBy', language)}</label>
                <select 
                  value={filterRating} 
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  {filterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
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
                  <p>{getTranslation('loading', language)}</p>
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
                        <ThumbsUp size={16} /> {getTranslation('helpful', language)}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Empty State - No reviews match current filters
                <div className="empty-state">
                  <MessageCircle size={48} />
                  <p>{getTranslation('noReviews', language)}</p>
                </div>
              )}
            </div>

            {/* Additional empty state fallback */}
            {filteredReviews.length === 0 && (
              <div className="empty-state">
                <MessageCircle size={48} />
                <p>{getTranslation('noReviews', language)}</p>
              </div>
            )}
          </div>
        </section>

        {/* WRITE REVIEW CTA - Call-to-action section */}
        <section className="write-review-cta">
          <div className="container">
            <div className="cta-content">
              <h2>{getTranslation('shareExperience', language)}</h2>
              <p>{getTranslation('ctaShareReview', language)}</p>
              <button 
                className="cta-button"
                onClick={openReviewForm}
              >
                {getTranslation('writeReview', language)}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* REVIEW FORM MODAL */}
      {showReviewForm && (
        <div className="review-modal-overlay" onClick={closeReviewForm}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h2>{getTranslation('writeReview', language)}</h2>
              <button className="close-btn" onClick={closeReviewForm}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              {/* Success/Error Message */}
              {submitMessage && (
                <div className={`message-box ${submitMessage.type}`}>
                  {submitMessage.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span>{submitMessage.text}</span>
                </div>
              )}

              {/* Destination Display */}
              {selectedDestination && (
                <div className="selected-destination">
                  <p className="dest-label">{getTranslation('reviewingDestination', language)}</p>
                  <p className="dest-name">{selectedDestination.name}</p>
                </div>
              )}

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="review-form">
                {/* Rating Input */}
                <div className="form-group">
                  <label>{getTranslation('rating', language)} *</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        title={`${star} ${getTranslation('stars', language)}`}
                      >
                        <Star 
                          size={32} 
                          fill={formData.rating >= star ? '#f59e0b' : '#e5e7eb'} 
                          color={formData.rating >= star ? '#f59e0b' : '#e5e7eb'}
                        />
                      </button>
                    ))}
                  </div>
                  {formErrors.rating && <span className="error-text">{formErrors.rating}</span>}
                </div>

                {/* Comment Input */}
                <div className="form-group">
                  <label>
                    {getTranslation('comment', language)} *
                    <span className="char-count">{formData.comment.length}/500</span>
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleFormChange}
                    placeholder={getTranslation('commentPlaceholder', language)}
                    maxLength={500}
                    rows={5}
                    className="comment-input"
                  />
                  {formErrors.comment && <span className="error-text">{formErrors.comment}</span>}
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={closeReviewForm}
                    disabled={submitting}
                  >
                    {getTranslation('cancel', language)}
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? getTranslation('submitting', language) : getTranslation('submit', language)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN FORM MODAL */}
      {showLoginForm && (
        <div className="login-modal-overlay" onClick={closeLoginForm}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h2>{getTranslation('login', language)}</h2>
              <button className="close-btn" onClick={closeLoginForm}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              <p className="login-subtitle">{getTranslation('loginRequired', language)}</p>

              {/* Error Message */}
              {loginError && (
                <div className="message-box error">
                  <AlertCircle size={20} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="login-form">
                {/* Email Input */}
                <div className="form-group">
                  <label>{getTranslation('email', language)} *</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="you@example.com"
                    className="login-input"
                    disabled={loginLoading}
                  />
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label>{getTranslation('password', language)} *</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className="login-input"
                    disabled={loginLoading}
                  />
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={closeLoginForm}
                    disabled={loginLoading}
                  >
                    {getTranslation('cancel', language)}
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loginLoading}
                  >
                    {loginLoading ? getTranslation('sending', language) : getTranslation('login', language)}
                  </button>
                </div>

                {/* Signup Link */}
                <p className="signup-link">
                  {getTranslation('needAccount', language)}
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Reviews;