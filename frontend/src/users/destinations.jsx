/**
 * Destinations Page Component
 * 
 * Displays a list of travel destinations in Kenya with filtering capabilities.
 * Users can browse by category (hotels, restaurants, activities) and view
 * destination details including ratings and descriptions.
 * 
 * Features:
 * - Fetch destinations from backend API
 * - Filter by category (accommodation, gastronomy, activity)
 * - Display destination cards with ratings
 * - Responsive design for mobile and desktop
 * 
 * API Integration:
 * - Fetch destinations from backend API
 */

import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import MapView from "./MapView.jsx";
import { Bed, Coffee, Sparkles, Star, MapPin, Heart, Users, Map, Grid3x3 } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import './css/destinations.css';

// API base URL for all backend requests
const API_BASE = 'http://localhost:8000/api';

/**
 * Category options displayed in filter buttons
 * Maps to destination categories in database
 */
const heroCategories = [
  { label: 'All', value: '', icon: Sparkles },           // Show all destinations
  { label: 'Hotels', value: 'accommodation', icon: Bed }, // Filter accommodations
  { label: 'Restaurants', value: 'gastronomy', icon: Coffee }, // Filter restaurants
  { label: 'Adventures', value: 'adventure', icon: Users }, // Filter adventures
  { label: 'Activities', value: 'activity', icon: Sparkles }, // Filter activities
];

/**
 * Marketing perks displayed in hero section
 * Shows value propositions for the service
 */
const perks = [
  { title: 'Curated stays', value: '120+', description: 'Handpicked hotels and unique homes.' },
  { title: 'Top rated', value: '4.8 ★', description: 'Trusted reviews from guests worldwide.' },
  { title: 'Local guides', value: '50+', description: 'Authentic experiences with insider tips.' },
];

/**
 * Destinations Page Component
 * 
 * Main component for displaying and filtering travel destinations
 * 
 * @returns {JSX.Element} Rendered destinations page
 */
function Destinations() {
  const { language } = useLanguage();
  const navigate = useNavigate(); // Initialize navigation
  // State management
  const [destinations, setDestinations] = useState([]);    // All destinations from API
  const [loading, setLoading] = useState(true);            // Loading indicator
  const [activeCategory, setActiveCategory] = useState(''); // Selected filter category
  const [viewMode, setViewMode] = useState('grid');         // View mode: 'grid' or 'map'

  // Dynamic category options based on language
  const heroCategories = [
    { label: getTranslation('all', language), value: '', icon: Sparkles },
    { label: getTranslation('hotels', language), value: 'accommodation', icon: Bed },
    { label: getTranslation('restaurants', language), value: 'gastronomy', icon: Coffee },
    { label: getTranslation('adventures', language), value: 'adventure', icon: Users },
    { label: getTranslation('activities', language), value: 'activity', icon: Sparkles },
  ];

  // Dynamic perks based on language
  const perks = [
    { 
      title: getTranslation('curatedStays', language), 
      value: '120+', 
      description: getTranslation('handpicked', language) 
    },
    { 
      title: getTranslation('topRated', language), 
      value: '4.8 ★', 
      description: getTranslation('trustedReviews', language) 
    },
    { 
      title: getTranslation('localGuides', language), 
      value: '50+', 
      description: getTranslation('authenticExperiences', language) 
    },
  ];

  /**
   * Effect Hook - Fetch destinations on component mount
   * Called only once when component first renders (empty dependency array)
   */
  useEffect(() => {
    fetchDestinations();
  }, []);

  /**
   * Fetch Destinations from Backend API
   * 
   * Makes GET request to fetch all destinations from database.
   * Shows empty state if API fails or returns no data.
   * Updates loading state when complete.
   * 
   * @async
   * @returns {Promise<void>}
   */
  const fetchDestinations = async () => {
    try {
      // Make API request to get destinations
      const response = await fetch(`${API_BASE}/destinations`);
      const data = await response.json();
      
      // Update state with fetched data or empty array if unavailable
      if (data.data && Array.isArray(data.data)) {
        setDestinations(data.data);
      } else {
        setDestinations([]);
      }
    } catch (error) {
      // Log error and show empty state on failure
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    } finally {
      // Mark loading as complete
      setLoading(false);
    }
  };

  /**
   * Memoized Filtered Destinations
   * 
   * Filters destinations by category using useMemo for performance optimization.
   * Only recalculates when activeCategory or destinations changes.
   * 
   * Dependencies:
   *   - activeCategory: When user clicks a category filter
   *   - destinations: When new data is fetched from API
   */
  const filteredDestinations = useMemo(() => {
    // Return all destinations if no filter selected
    if (!activeCategory) return destinations;
    
    // Filter destinations matching selected category
    return destinations.filter((place) => 
      String(place.category || '').toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, destinations]);

  // Get first 6 destinations for featured section
  const featuredDestinations = filteredDestinations.slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="destinations-page">
        {/* HEADER */}
        <header className="page-header">
          <div className="container">
            <h1>{getTranslation('welcome', language)}</h1>
            <p>{getTranslation('exploreDestinations', language)}</p>
          </div>
        </header>

        {/* SECTION 1: HERO */}
        <section className="destinations-hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <div className="badge"><Sparkles size={16} /> {getTranslation('all', language)}</div>
                <h2>{getTranslation('planYourTrip', language)}</h2>
                <div className="perks-list">
                  {perks.map(perk => (
                    <div key={perk.title} className="perk-item">
                      <strong>{perk.value}</strong>
                      <span>{perk.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FILTERS */}
        <section className="filter-section">
          <div className="container">
            <div className="filter-group">
              {heroCategories.map((cat) => (
                <button 
                  key={cat.value}
                  className={`filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.value)}
                >
                  <cat.icon size={18} /> {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURED DESTINATIONS */}
        <section className="listings-section">
          <div className="container">
            <div className="listings-header">
              <h2 className="section-title">{getTranslation('exploreDestinations', language)}</h2>
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Grid3x3 size={18} /> {getTranslation('gridView', language)}
                </button>
                <button 
                  className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                  onClick={() => setViewMode('map')}
                  title="Map view"
                >
                  <Map size={18} /> {getTranslation('mapView', language)}
                </button>
              </div>
            </div>
            <div className="content-layout">
              {viewMode === 'grid' && (
              <div className="cards-grid">
                {loading ? (
                  <div className="loading-state">
                    <Sparkles size={48} />
                    <p>{getTranslation('loading', language)}</p>
                  </div>
                ) : featuredDestinations.length > 0 ? (
                  featuredDestinations.map((place) => (
                    <div key={place.id || place.name} className="simple-card">
                      <div className="card-image-wrapper">
                        <img src={place.image_url || place.image} alt={place.name} className="card-image" />
                        <button className="favorite-btn" aria-label="Add to favorites">
                          <Heart size={20} />
                        </button>
                      </div>
                      <div className="card-content">
                        <h3>{place.name}</h3>
                        <p>{place.description}</p>
                        <div className="card-footer">
                          <div className="rating">
                            <Star size={16} fill="currentColor" /> {place.rating || 0}
                            <span className="reviews">({place.reviews || 0})</span>
                          </div>
                          <button 
                            className="view-details-btn"
                            onClick={() => navigate(`/destination/${place.id}`)}
                          >
                            {getTranslation('viewDetails', language)}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Sparkles size={48} />
                    <p>{getTranslation('noDestinations', language)}</p>
                  </div>
                )}
              </div>
              )}
              
              {viewMode === 'map' && (
              <div className="map-view-container">
                <MapView 
                  destinations={filteredDestinations} 
                  onMarkerClick={(destination) => {
                    console.log('Clicked destination:', destination);
                  }}
                  onViewDetails={(destination) => {
                    navigate(`/destination/${destination.id}`);
                  }}
                />
              </div>
              )}
            </div>
          </div>
        </section>



        {/* SECTION 6: CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to start your Kenya adventure?</h2>
              <p>Join thousands of travelers discovering incredible experiences with Wise Explore</p>
              <button 
                className="cta-button"
                onClick={() => navigate('/ai-planner?showForm=true')}
              >
                Plan Your Trip
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 7: FOOTER LINKS */}
        <section className="footer-links">
          <div className="container">
            <div className="links-grid">
              <div>
                <h4>Our Story</h4>
                <p>How Wise Explore started and why we're passionate about authentic travel experiences.</p>
              </div>
              <div>
                <h4>Contact & Support</h4>
                <p>Got questions? Get in touch with our team for personalized travel recommendations.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Destinations;