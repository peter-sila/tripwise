/**
 * Destination Details Page Component
 * 
 * Displays comprehensive information about a single destination including:
 * - Large featured image
 * - Destination name, location, and description
 * - Rating and review count
 * - Category information
 * - Related information
 * - Link to write reviews
 * 
 * @component
 * @returns {JSX.Element} Destination details page
 */

import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Star, MapPin, Heart, Share2, ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import { getSafeImageUrl } from './utils/imageUtils';
import './css/destinationdetails.css';

// API base URL for backend requests
const API_BASE = 'http://localhost:8000/api';

/**
 * Destination Details Component
 * 
 * Fetches and displays detailed information about a specific destination.
 * Allows users to favorite, share, and write reviews for the destination.
 * 
 * @returns {JSX.Element} Rendered destination details page
 */
function DestinationDetails() {
  const { id } = useParams(); // Get destination ID from URL params
  const navigate = useNavigate(); // For navigation
  const { language } = useLanguage(); // Get current language
  
  // State management
  const [destination, setDestination] = useState(null);     // Destination data
  const [loading, setLoading] = useState(true);             // Loading state
  const [error, setError] = useState(null);                 // Error message
  const [isFavorited, setIsFavorited] = useState(false);    // Favorite status
  const [reviews, setReviews] = useState([]);               // Related reviews

  /**
   * Fetch Destination Details from Backend API
   * 
   * Makes GET request to fetch detailed information about a specific destination.
   * 
   * @async
   * @returns {Promise<void>}
   */
  async function fetchDestinationDetails() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/destinations/${id}`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        setDestination(data.data);
      } else {
        setError(getTranslation('destinationNotFound', language));
      }
    } catch (error) {
      console.error('Error fetching destination:', error);
      setError(getTranslation('errorLoadingDestination', language));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch Reviews for This Destination
   * 
   * Gets all reviews for the current destination from backend API.
   * 
   * @async
   * @returns {Promise<void>}
   */
  async function fetchDestinationReviews() {
    try {
      const response = await fetch(`${API_BASE}/reviews?destination_id=${id}`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // Get only first 3 reviews for preview
        setReviews(data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchDestinationDetails();
    fetchDestinationReviews();
  }, [id]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  /**
   * Toggle Favorite Status
   */
  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Save to backend when favorite feature is implemented
  };

  /**
   * Share Destination
   */
  const handleShare = () => {
    if (navigator.share && destination) {
      navigator.share({
        title: destination.name,
        text: destination.description,
        url: window.location.href,
      }).catch((error) => console.error('Share error:', error));
    } else {
      // Fallback: Copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  /**
   * Navigate to Write Review Page
   */
  const handleWriteReview = () => {
    // Navigate to reviews page with destination ID in state
    navigate('/reviews', { state: { destinationId: id } });
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="destination-details-page">
          <div className="container">
            <div className="loading-state">
              <Sparkles size={48} />
              <p>{getTranslation('loading', language)}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !destination) {
    return (
      <>
        <Navbar />
        <main className="destination-details-page">
          <div className="container">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} /> {getTranslation('back', language)}
            </button>
            <div className="error-state">
              <h2>{error || getTranslation('destinationNotFound', language)}</h2>
              <button 
                className="primary-btn"
                onClick={() => navigate('/')}
              >
                {getTranslation('backToDestinations', language)}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="destination-details-page">
        {/* Back Button */}
        <div className="header-nav">
          <div className="container">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} /> {getTranslation('back', language)}
            </button>
          </div>
        </div>

        {/* Featured Image Section */}
        <section className="featured-image-section">
          <div className="image-container">
            {destination.image_url && (
              <img 
                src={getSafeImageUrl(destination.image_url)} 
                alt={destination.name}
                className="featured-image"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><rect width='100%' height='100%' fill='%23eaeaea'/><text x='50%' y='50%' font-size='36' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial, Helvetica, sans-serif'>No Image</text></svg>"; }}
              />
            )}
            <div className="image-overlay"></div>
            
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className={`action-btn favorite-btn ${isFavorited ? 'active' : ''}`}
                onClick={handleToggleFavorite}
                title="Add to favorites"
              >
                <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              <button 
                className="action-btn share-btn"
                onClick={handleShare}
                title="Share destination"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="main-content">
          <div className="container">
            {/* Header Info */}
            <div className="header-info">
              <h1>{destination.name}</h1>
              
              <div className="destination-meta">
                <div className="location-info">
                  <MapPin size={18} />
                  <span>{destination.location || 'Kenya'}</span>
                </div>
                
                {destination.category && (
                  <div className="category-badge">
                    {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                  </div>
                )}
              </div>

              {/* Rating Section */}
              <div className="rating-section">
                <div className="rating-info">
                  <div className="stars">
                    <Star size={20} fill="currentColor" />
                    <span className="rating-value">{destination.rating || 0}</span>
                  </div>
                  <span className="review-count">
                    ({destination.reviews || 0} {destination.reviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <section className="description-section">
              <h2>{getTranslation('about', language)}</h2>
              <p className="description-text">
                {destination.description}
              </p>
            </section>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <section className="reviews-section">
                <h2>{getTranslation('recentReviews', language)}</h2>
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id || review.comment} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <h4>{review.user_name || 'Anonymous'}</h4>
                          <div className="review-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                                className={i < review.rating ? 'filled' : ''}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="review-text">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="cta-section">
              <h2>{getTranslation('experienceThis', language)}</h2>
              <p>
                {destination.name} {getTranslation('shareYourExperience', language)}
              </p>
              <button 
                className="primary-btn write-review-btn"
                onClick={handleWriteReview}
              >
                <MessageCircle size={18} />
                {getTranslation('writeReview', language)}
              </button>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default DestinationDetails;
