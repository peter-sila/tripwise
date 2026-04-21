import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Search, MapPin, Heart, Share2, Tag, TrendingUp, Filter, Map } from 'lucide-react';
import React, { useState } from 'react';
import './css/discover.css';

const categories = [
  { id: 'all', label: 'All', emoji: '🌍' },
  { id: 'nature', label: 'Nature', emoji: '🌲' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'adventure', label: 'Adventure', emoji: '🏃' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];

const discoveries = [
  { id: 1, title: 'Giraffe Centre', category: 'nature', location: 'Nairobi', image: '/images/giraffe.jpg', rating: 4.9, reviews: 234, trending: true },
  { id: 2, title: 'Hell\'s Gate National Park', category: 'adventure', location: 'Rift Valley', image: '/images/hells-gate.jpg', rating: 4.8, reviews: 189, trending: false },
  { id: 3, title: 'Lamu Old Town', category: 'culture', location: 'Lamu', image: '/images/lamu.jpg', rating: 4.7, reviews: 456, trending: true },
  { id: 4, title: 'Nairobi National Museum', category: 'culture', location: 'Nairobi', image: '/images/museum.jpg', rating: 4.6, reviews: 312, trending: false },
  { id: 5, title: 'Karen Blixen Museum', category: 'culture', location: 'Nairobi', image: '/images/karen-museum.jpg', rating: 4.8, reviews: 267, trending: false },
  { id: 6, title: 'Masai Market', category: 'shopping', location: 'Nairobi', image: '/images/masai-market.jpg', rating: 4.5, reviews: 523, trending: true },
];

function Discover() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  const filteredDiscoveries = discoveries.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <h2>Found {filteredDiscoveries.length} discoveries</h2>
              <div className="view-toggle">
                <button className="view-btn active"><Map size={18} /> Grid</button>
              </div>
            </div>

            <div className="discoveries-grid">
              {filteredDiscoveries.length > 0 ? (
                filteredDiscoveries.map(item => (
                  <div key={item.id} className="discovery-card">
                    <div className="discovery-image">
                      <img src={item.image} alt={item.title} />
                      {item.trending && <div className="trending-badge"><TrendingUp size={14} /> Trending</div>}
                      <button
                        className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item.id)}
                        aria-label="Add to favorites"
                      >
                        <Heart size={20} />
                      </button>
                    </div>

                    <div className="discovery-content">
                      <h3>{item.title}</h3>
                      <div className="location">
                        <MapPin size={16} /> {item.location}
                      </div>
                      <div className="rating">
                        <span className="stars">⭐ {item.rating}</span>
                        <span className="reviews">({item.reviews} reviews)</span>
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