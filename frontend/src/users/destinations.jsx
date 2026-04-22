import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Bed, Coffee, Sparkles, Star, MapPin, Heart, Users } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import './css/destinations.css';

const API_BASE = 'http://localhost:8000/backend/api';

const heroCategories = [
  { label: 'All', value: '', icon: Sparkles },
  { label: 'Hotels', value: 'accommodation', icon: Bed },
  { label: 'Restaurants', value: 'gastronomy', icon: Coffee },
  { label: 'Activities', value: 'activity', icon: Sparkles },
];

const perks = [
  { title: 'Curated stays', value: '120+', description: 'Handpicked hotels and unique homes.' },
  { title: 'Top rated', value: '4.8 ★', description: 'Trusted reviews from guests worldwide.' },
  { title: 'Local guides', value: '50+', description: 'Authentic experiences with insider tips.' },
];

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE}/destinations.php`);
      const data = await response.json();
      if (data.destinations) {
        setDestinations(data.destinations);
      } else {
        setDestinations([]);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredDestinations = useMemo(() => {
    if (!activeCategory) return destinations;
    return destinations.filter((place) => 
      String(place.category || '').toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, destinations]);

  const featuredDestinations = filteredDestinations.slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="destinations-page">
        {/* HEADER */}
        <header className="page-header">
          <div className="container">
            <h1>Discover unforgettable experiences in Kenya</h1>
            <p>Explore curated accommodations, dining, and activities.</p>
          </div>
        </header>

        {/* SECTION 1: HERO */}
        <section className="destinations-hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <div className="badge"><Sparkles size={16} /> Popular categories</div>
                <h2>Find the best stay, bite, and adventure.</h2>
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
            <h2 className="section-title">Featured Destinations</h2>
            <div className="content-layout">
              <div className="cards-grid">
                {loading ? (
                  <div className="loading-state">
                    <Sparkles size={48} />
                    <p>Loading destinations...</p>
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
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Sparkles size={48} />
                    <p>No destinations found. Try a different category!</p>
                  </div>
                )}
              </div>
              
              {/* MAP PLACEHOLDER */}
              <div className="map-placeholder">
                <div className="map-mock-bg">
                  <div className="map-content">
                    <MapPin size={48} />
                    <p>Map View</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* SECTION 6: CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to start your Kenya adventure?</h2>
              <p>Join thousands of travelers discovering incredible experiences with Wise Explore</p>
              <button className="cta-button">Plan Your Trip</button>
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