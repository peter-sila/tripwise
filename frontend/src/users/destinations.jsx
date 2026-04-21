import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Bed, Coffee, Sparkles, Star, MapPin, Heart, Users } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import './css/destinations.css';

const heroCategories = [
  { label: 'All', value: 'all', icon: Sparkles },
  { label: 'Hotels', value: 'accommodation', icon: Bed },
  { label: 'Restaurants', value: 'gastronomy', icon: Coffee },
  { label: 'Activities', value: 'activity', icon: Sparkles },
];

const perks = [
  { title: 'Curated stays', value: '120+', description: 'Handpicked hotels and unique homes.' },
  { title: 'Top rated', value: '4.8 ★', description: 'Trusted reviews from guests worldwide.' },
  { title: 'Local guides', value: '50+', description: 'Authentic experiences with insider tips.' },
];

const mockDestinations = [
  { name: 'Serena Safari Lodge', category: 'accommodation', description: 'Luxury lodge with stunning views of the savanna and prime wildlife viewing.', image: '/images/serena-lodge.jpg', rating: 4.9, reviews: 342 },
  { name: 'The Bomas of Kenya Restaurant', category: 'gastronomy', description: 'Authentic Kenyan cuisine showcasing traditional recipes and tribal dishes.', image: '/images/bomas-restaurant.jpg', rating: 4.7, reviews: 218 },
  { name: 'Great Migration Safari', category: 'activity', description: 'Witness the incredible annual wildebeest migration across the Masai Mara.', image: '/images/migration.jpg', rating: 4.8, reviews: 456 },
  { name: 'Tamarind Group Restaurant', category: 'gastronomy', description: 'Award-winning seafood restaurant with coastal charm and ocean views.', image: '/images/tamarind.jpg', rating: 4.9, reviews: 523 },
  { name: 'Giraffe Centre Experience', category: 'activity', description: 'Interactive encounter with endangered Rothschild giraffes near Nairobi.', image: '/images/giraffe-centre.jpg', rating: 4.8, reviews: 387 },
  { name: 'Villa Rosa Kempinski', category: 'accommodation', description: 'Five-star luxury hotel in the heart of Nairobi with world-class amenities.', image: '/images/villa-rosa.jpg', rating: 4.9, reviews: 441 },
];

const iconicPlaces = [
  { name: 'Nairobi', detail: 'Urban safari and culture.', image: '/images/nairobi.jpg', attractions: 24 },
  { name: 'Mombasa', detail: 'Coastal charm and history.', image: '/images/mombasa.jpg', attractions: 18 },
  { name: "Hell's Gate", detail: 'Gorges and exploration.', image: '/images/hells-gate.jpg', attractions: 12 },
  { name: 'Tsavo', detail: 'Wildlife and safari routes.', image: '/images/tsavo.jpg', attractions: 15 },
];

const stories = [
  { title: 'A safari story', summary: 'Witness the Great Migration.', image: '/images/travel-story1.jpg', date: 'March 2024' },
  { title: 'Sunsets of Lamu', summary: 'Discover coastal islands.', image: '/images/travel-story2.jpg', date: 'February 2024' },
];

function Destinations() {
  const [destinations, setDestinations] = useState(mockDestinations);
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter logic
  const filteredDestinations = useMemo(() => {
    if (activeCategory === 'all') return destinations;
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
                {featuredDestinations.length > 0 ? (
                  featuredDestinations.map((place) => (
                    <div key={place.name} className="simple-card">
                      <div className="card-image-wrapper">
                        <img src={place.image} alt={place.name} className="card-image" />
                        <button className="favorite-btn" aria-label="Add to favorites">
                          <Heart size={20} />
                        </button>
                      </div>
                      <div className="card-content">
                        <h3>{place.name}</h3>
                        <p>{place.description}</p>
                        <div className="card-footer">
                          <div className="rating">
                            <Star size={16} fill="currentColor" /> {place.rating}
                            <span className="reviews">({place.reviews})</span>
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

        {/* SECTION 4: ICONIC PLACES */}
        <section className="iconic-places-section">
          <div className="container">
            <h2 className="section-title">Iconic Places to Explore</h2>
            <div className="iconic-grid">
              {iconicPlaces.map(place => (
                <div key={place.name} className="iconic-card">
                  <div className="iconic-image" style={{backgroundImage: `url(${place.image})`}}>
                    <div className="iconic-overlay">
                      <h3>{place.name}</h3>
                      <p>{place.detail}</p>
                      <div className="attractions-badge">
                        <MapPin size={16} /> {place.attractions} attractions
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: TRAVEL STORIES */}
        <section className="stories-section">
          <div className="container">
            <h2 className="section-title">Travel Stories from our community</h2>
            <div className="stories-grid">
              {stories.map(story => (
                <div key={story.title} className="story-item">
                  <div className="story-img" style={{backgroundImage: `url(${story.image})`}}>
                    <div className="story-text">
                      <span className="story-date">{story.date}</span>
                      <h4>{story.title}</h4>
                      <p>{story.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
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