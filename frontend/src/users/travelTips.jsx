import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { AlertCircle, Heart, Clock, DollarSign, Shield, Lightbulb, BookOpen, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './css/traveltips.css';

const API_BASE = 'http://localhost:8000/backend/api';

const categories = [
  { id: '', label: 'All', icon: '📚' },
  { id: 'packing', label: 'Packing', icon: '🎒' },
  { id: 'safety', label: 'Safety', icon: '🛡️' },
  { id: 'budget', label: 'Budget', icon: '💰' },
  { id: 'health', label: 'Health', icon: '💊' },
  { id: 'culture', label: 'Culture', icon: '🎭' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
];

function TravelTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedTip, setExpandedTip] = useState(null);

  useEffect(() => {
    fetchTips();
  }, [selectedCategory]);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const url = selectedCategory 
        ? `${API_BASE}/travelTips.php?category=${selectedCategory}` 
        : `${API_BASE}/travelTips.php`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.travel_tips && data.travel_tips.length > 0) {
        setTips(data.travel_tips);
      } else {
        setTips([]);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTips = selectedCategory === '' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  return (
    <>
      <Navbar />

      <main className="travel-tips-page">
        {/* HERO SECTION */}
        <header className="page-header">
          <div className="container">
            <div className="hero-content">
              <Lightbulb size={48} className="hero-icon" />
              <h1>Travel Tips & Guides</h1>
              <p>Expert advice to make your Kenya trip unforgettable</p>
            </div>
          </div>
        </header>

        {/* QUICK TIPS SECTION */}
        <section className="quick-tips">
          <div className="container">
            <div className="quick-tips-grid">
              <div className="quick-tip-card">
                <AlertCircle size={32} />
                <h3>Best Time to Visit</h3>
                <p>June-October for wildlife viewing; November-March for beaches</p>
              </div>
              <div className="quick-tip-card">
                <Heart size={32} />
                <h3>What to Love</h3>
                <p>Authentic culture, incredible wildlife, and stunning landscapes</p>
              </div>
              <div className="quick-tip-card">
                <Clock size={32} />
                <h3>Time Zone</h3>
                <p>Kenya Standard Time (KST): UTC+3, No daylight saving time</p>
              </div>
              <div className="quick-tip-card">
                <DollarSign size={32} />
                <h3>Currency</h3>
                <p>Kenyan Shilling (KES): 1 USD ≈ 130-140 KES</p>
              </div>
            </div>
          </div>
        </section>

        {/* TIPS SECTION */}
        <section className="tips-section">
          <div className="container">
            <div className="tips-layout">
              {/* Category Sidebar */}
              <aside className="tips-sidebar">
                <h3>Categories</h3>
                <div className="category-list">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="cat-icon">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Tips List */}
              <div className="tips-content">
                <div className="tips-header">
                  <h2>{categories.find(c => c.id === selectedCategory)?.label || 'All'} Tips</h2>
                  <span className="tip-count">{filteredTips.length} tips</span>
                </div>

                <div className="tips-list">
                  {loading ? (
                    <div className="loading-state">
                      <BookOpen size={48} />
                      <p>Loading tips...</p>
                    </div>
                  ) : filteredTips.length > 0 ? (
                    filteredTips.map(tip => (
                      <article key={tip.id} className="tip-card">
                        <div
                          className="tip-header"
                          onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                        >
                          <h4>{tip.title}</h4>
                          <ChevronRight
                            size={20}
                            className={`chevron ${expandedTip === tip.id ? 'open' : ''}`}
                          />
                        </div>

                        {expandedTip === tip.id && (
                          <div className="tip-content">
                            <p>{tip.content}</p>
                            <div className="tip-footer">
                              <span className="author">By {tip.user_name}</span>
                              <span className="date">{new Date(tip.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}

                        {expandedTip !== tip.id && (
                          <p className="tip-excerpt">{tip.content.substring(0, 100)}...</p>
                        )}
                      </article>
                    ))
                  ) : (
                    <div className="empty-state">
                      <BookOpen size={48} />
                      <p>No tips found in this category.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready for Your Adventure?</h2>
              <p>Now that you have all the tips, start planning your perfect Kenya trip</p>
              <button className="cta-button">Start Planning</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default TravelTips;