import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Search, MapPin, Heart, Share2, Tag, TrendingUp, Filter, Map } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './css/discover.css';

const API_BASE = 'http://localhost:8000/backend/api';

const categories = [
  { id: '', label: 'All', emoji: '🌍' },
  { id: 'nature', label: 'Nature', emoji: '🌲' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'adventure', label: 'Adventure', emoji: '🏃' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];

function Discover() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchDiscoveries();
  }, [activeCategory, searchTerm]);

  const fetchDiscoveries = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (activeCategory) params.append('category', activeCategory);
      
      const response = await fetch(`${API_BASE}/destinations.php?${params}`);
      const data = await response.json();
      if (data.destinations) {
        setDiscoveries(data.destinations);
      }
    } catch (error) {
      console.error('Error fetching discoveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Navbar />

      <main className="discover-page">
        {/* HERO SECTION */}
        <header className="page-header">
          <div className="container">
            <h1>Discover Hidden Gems</h1>
            <p>Explore unique experiences curated by our community</p>
          </div>
        </header>

        {/* SEARCH & FILTER SECTION */}
        <section className="search-section">
          <div className="container">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search destinations, attractions, experiences..."
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
              <h2>Found {discoveries.length} discoveries</h2>
              <div className="view-toggle">
                <button className="view-btn active"><Map size={18} /> Grid</button>
              </div>
            </div>

            <div className="discoveries-grid">
              {loading ? (
                <div className="loading-state">
                  <Search size={48} />
                  <p>Loading discoveries...</p>
                </div>
              ) : discoveries.length > 0 ? (
                discoveries.map(item => (
                  <div key={item.id} className="discovery-card">
                    <div className="discovery-image">
                      <img src={item.image_url || item.image} alt={item.name} />
                      <button
                        className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item.id)}
                        aria-label="Add to favorites"
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
                        <span className="reviews">({item.reviews || 0} reviews)</span>
                      </div>

                      <div className="card-actions">
                        <button className="action-btn share-btn">
                          <Share2 size={16} /> Share
                        </button>
                        <button className="action-btn learn-btn">Learn More</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Search size={48} />
                  <p>No discoveries found. Try a different search or category!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Found Your Favorite Spot?</h2>
              <p>Plan your visit and book accommodations through TripWise</p>
              <button className="cta-button">Start Planning</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Discover;