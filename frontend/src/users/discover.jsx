/**
 * Discover Page Component
 * 
 * Allows users to search and explore destinations with advanced filtering.
 * Users can:
 * - Search destinations by name, location, or description
 * - Filter by category (nature, culture, adventure, food, shopping)
 * - Add/remove destinations from favorites
 * - View destination details and share them
 * 
 * Features:
 * - Real-time search with debounced API calls
 * - Category-based filtering
 * - Grid view layout
 * - Favorites toggle (client-side state only)
 * - Image display for destinations
 * - Rating and review count display
 * 
 * @component
 * @returns {JSX.Element} Discover page with search and filtering
 */

import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import MapView from "./MapView.jsx";
import { Search, MapPin, Heart, Share2, Tag, TrendingUp, Filter, Map, Grid3x3 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import './css/discover.css';

// API base URL for backend requests
const API_BASE = 'http://localhost:8000/api';

/**
 * Available categories for filtering destinations
 * Each category includes an emoji for visual representation
 */
const categories = [
  { id: '', label: 'All', emoji: '🌍' },
  { id: 'nature', label: 'Nature', emoji: '🌲' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'adventure', label: 'Adventure', emoji: '🏃' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];

/**
 * Discover Component
 * 
 * Main component for discovery page with search and filtering
 * 
 * State Variables:
 *   - activeCategory: Currently selected category filter
 *   - searchTerm: User's search query text
 *   - discoveries: Array of search results
 *   - loading: Loading indicator for API calls
 *   - favorites: Array of favorited destination IDs (client-side only)
 * 
 * @returns {JSX.Element} Rendered discover page
 */
function Discover() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Category options with translations
  const categories = [
    { id: '', label: getTranslation('all', language), emoji: '🌍' },
    { id: 'nature', label: getTranslation('nature', language), emoji: '🌲' },
    { id: 'culture', label: getTranslation('culture', language), emoji: '🎭' },
    { id: 'adventure', label: getTranslation('adventure', language), emoji: '🏃' },
    { id: 'food', label: getTranslation('food', language), emoji: '🍽️' },
    { id: 'shopping', label: getTranslation('shopping', language), emoji: '🛍️' },
  ];
  
  // Filter state
  const [activeCategory, setActiveCategory] = useState('');     // Current category filter
  const [searchTerm, setSearchTerm] = useState('');             // Current search text
  
  // Data state
  const [discoveries, setDiscoveries] = useState([]);           // Search results
  const [loading, setLoading] = useState(true);                 // Loading state
  const [favorites, setFavorites] = useState([]);               // Favorited destination IDs
  const [viewMode, setViewMode] = useState('grid');             // View mode: 'grid' or 'map'

  /**
   * Effect Hook: Initialize search from URL parameters
   * 
   * On component mount, check if there's a search parameter in the URL
   * and set the search term accordingly
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSearch = params.get('search');
    if (urlSearch) {
      setSearchTerm(decodeURIComponent(urlSearch));
    }
  }, []);

  /**
   * Effect Hook: Fetch discoveries when search or category changes
   * 
   * Re-fetches results whenever:
   *   - User types in search box (activeCategory changes)
   *   - User selects a category (searchTerm changes)
   * 
   * Dependencies: activeCategory, searchTerm
   */
  useEffect(() => {
    fetchDiscoveries();
  }, [activeCategory, searchTerm]);

  /**
   * Fetch Discoveries from Backend API
   * 
   * Makes API call to get destinations matching current search/category filters.
   * Constructs query parameters dynamically based on active filters.
   * Handles loading state and errors gracefully.
   * 
   * Query Parameters:
   *   - search: Search term for name/description/location
   *   - category: Category filter
   * 
   * @async
   * @returns {Promise<void>}
   */
  const fetchDiscoveries = async () => {
    try {
      // Build query parameters based on active filters
      const params = new URLSearchParams();
      if (searchTerm) params.append('query', searchTerm);
      if (activeCategory) params.append('category', activeCategory);
      
      // Fetch destinations with active filters
      const response = await fetch(`${API_BASE}/destinations/search?${params}`);
      const data = await response.json();
      
      // Update state with results
      if (data.data && Array.isArray(data.data)) {
        setDiscoveries(data.data);
      }
    } catch (error) {
      console.error('Error fetching discoveries:', error);
    } finally {
      // Mark loading as complete
      setLoading(false);
    }
  };

  /**
   * Toggle Destination Favorite Status
   * 
   * Adds destination to favorites if not already favorited.
   * Removes from favorites if already in the list.
   * Note: This is client-side only - favorites not persisted to database
   * 
   * Future Enhancement: Save favorites to backend
   * 
   * @param {number} id - Destination ID to toggle favorite for
   */
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      // If already favorited, remove it; otherwise add it
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)  // Remove from favorites
        : [...prev, id]                    // Add to favorites
    );
  };

  return (
    <>
      <Navbar />

      <main className="discover-page">
        {/* HERO SECTION */}
        <header className="page-header">
          <div className="container">
            <h1>{getTranslation('discover', language)}</h1>
            <p>{getTranslation('searchDestinations', language)}</p>
          </div>
        </header>

        {/* SEARCH & FILTER SECTION */}
        <section className="search-section">
          <div className="container">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder={getTranslation('searchPlaceholder', language)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="category-filter">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="cat-emoji">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section className="results-section">
          <div className="container">
            <div className="results-header">
              <h2>{getTranslation('searchResults', language)}: {discoveries.length}</h2>
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Grid3x3 size={18} /> Grid
                </button>
                <button 
                  className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                  onClick={() => setViewMode('map')}
                  title="Map view"
                >
                  <Map size={18} /> Map
                </button>
              </div>
            </div>

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="map-view-container">
                <MapView 
                  destinations={discoveries} 
                  onMarkerClick={(destination) => {
                    console.log('Clicked destination:', destination);
                    // Could add modal/detail view here
                  }}
                />
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="discoveries-grid">
                {loading ? (
                  <div className="loading-state">
                    <Search size={48} />
                    <p>{getTranslation('loading', language)}</p>
                  </div>
                ) : discoveries.length > 0 ? (
                  discoveries.map(item => (
                    <div key={item.id} className="discovery-card">
                      <div className="discovery-image">
                        <img src={item.image_url || item.image} alt={item.name} />
                        <button
                          className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(item.id)}
                          aria-label={getTranslation('addToFavorites', language)}
                        >
                          <Heart size={20} />
                        </button>
                      </div>

                      <div className="discovery-content">
                        <h3>{item.name}</h3>
                        <div className="location">
                          <MapPin size={16} /> {item.location}
                        </div>
                        <div className="rating">
                          <span className="stars">⭐ {item.rating || 0}</span>
                          <span className="reviews">({item.reviews || 0} {getTranslation('reviews', language)})</span>
                        </div>

                        <div className="card-actions">
                          <button className="action-btn share-btn">
                            <Share2 size={16} /> {getTranslation('share', language)}
                          </button>
                          <button className="action-btn learn-btn">{getTranslation('reviews', language)}</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Search size={48} />
                    <p>{getTranslation('noResults', language)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Found Your Favorite Spot?</h2>
              <p>Plan your visit and book accommodations through TripWise</p>
              <button 
                className="cta-button"
                onClick={() => navigate('/ai-planner?showForm=true')}
              >
                Start Planning
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Discover;