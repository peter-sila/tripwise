/**
 * Travel Tips Page Component
 * 
 * Displays travel advice and guides organized by category.
 * Users can:
 * - Browse all travel tips from the community
 * - Filter tips by category (packing, safety, budget, health, culture, transport)
 * - Expand/collapse tip cards to read full content
 * - View tip author and publication date
 * 
 * Features:
 * - Category-based filtering
 * - Expandable tip cards
 * - Quick facts section with key travel info
 * - Loading and empty states
 * - Responsive layout with sidebar
 * 
 * @component
 * @returns {JSX.Element} Travel tips page with category filtering
 */

import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { AlertCircle, Heart, Clock, DollarSign, Shield, Lightbulb, BookOpen, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import './css/traveltips.css';

// API base URL for backend requests
const API_BASE = 'http://localhost:8000/api';

/**
 * Travel Tips Component
 * 
 * Main component for browsing travel tips with category filtering
 * 
 * State Variables:
 *   - tips: Array of all travel tips from database
 *   - loading: Loading indicator for API calls
 *   - selectedCategory: Currently selected category filter
 *   - expandedTip: ID of currently expanded tip (null if none)
 * 
 * @returns {JSX.Element} Rendered travel tips page
 */
function TravelTips() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const categories = [
    { id: '', label: getTranslation('allTips', language), icon: '📚' },
    { id: 'packing', label: getTranslation('packing', language), icon: '🎒' },
    { id: 'safety', label: getTranslation('safety', language), icon: '🛡️' },
    { id: 'budget', label: getTranslation('budget', language), icon: '💰' },
    { id: 'health', label: getTranslation('health', language), icon: '💊' },
    { id: 'culture', label: getTranslation('culture', language), icon: '🎭' },
    { id: 'transport', label: getTranslation('transportTips', language), icon: '🚗' },
  ];
  // Data state
  const [tips, setTips] = useState([]);                   // All tips from API
  const [loading, setLoading] = useState(true);           // Loading indicator
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(''); // Active category filter
  const [expandedTip, setExpandedTip] = useState(null);    // Currently expanded tip

  /**
   * Fetch Travel Tips from Backend API
   * 
   * Makes API call to get travel tips matching selected category.
   * If no category selected, fetches all tips.
   * Handles loading state and errors gracefully.
   * 
   * Query Parameters:
   *   - category (optional): Category ID to filter tips
   * 
   * @async
   * @returns {Promise<void>}
   */
  async function fetchTips() {
    setLoading(true);
    try {
      // Travel tips endpoint (placeholder for now)
      // In a real implementation, this would return travel tips from the backend
      const tips = [];
      
      // Update state with fetched tips or empty array
      if (tips && tips.length > 0) {
        setTips(tips);
      } else {
        setTips([]);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips([]);
    } finally {
      // Mark loading as complete
      setLoading(false);
    }
  }

  /**
   * Effect Hook: Fetch tips when category changes
   * 
   * Fetches travel tips whenever user selects a different category.
   * Dependency: selectedCategory - triggers fetch when category ID changes
   */
  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchTips();
  }, [selectedCategory]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  /**
   * Filter Tips Based on Category
   * 
   * Makes API call to get travel tips matching selected category.
   * If no category selected, fetches all tips.
   * Handles loading state and errors gracefully.
   * 
   * Query Parameters:
   *   - category (optional): Category ID to filter tips
   * 
   * @async
   * @returns {Promise<void>}
   */
  /**
   * Filter Tips Based on Category
   * 
   * Shows all tips if 'All' category selected, otherwise filters by category.
   * Note: Backend already filters if category passed, this is redundant but kept for safety.
   */
  const filteredTips = selectedCategory === '' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  return (
    <>
      <Navbar />

      <main className="travel-tips-page">
        {/* HERO SECTION - Page title with icon and description */}
        <header className="page-header">
          <div className="container">
            <div className="hero-content">
              <Lightbulb size={48} className="hero-icon" />
              <h1>{getTranslation('travelAdvice', language)}</h1>
              <p>{getTranslation('expertAdvice', language)}</p>
            </div>
          </div>
        </header>

        {/* QUICK TIPS SECTION - Fast facts about Kenya travel */}
        <section className="quick-tips">
          <div className="container">
            <div className="quick-tips-grid">
              {/* Quick tip: Best travel season */}
              <div className="quick-tip-card">
                <AlertCircle size={32} />
                <h3>{getTranslation('bestTimeToVisit', language)}</h3>
                <p>{getTranslation('bestTimeDescription', language)}</p>
              </div>
              <div className="quick-tip-card">
                <Heart size={32} />
                <h3>{getTranslation('whatToLove', language)}</h3>
                <p>{getTranslation('whatToLoveDescription', language)}</p>
              </div>
              <div className="quick-tip-card">
                <Clock size={32} />
                <h3>{getTranslation('timeZone', language)}</h3>
                <p>{getTranslation('timeZoneDescription', language)}</p>
              </div>
              <div className="quick-tip-card">
                <DollarSign size={32} />
                <h3>{getTranslation('currency', language)}</h3>
                <p>{getTranslation('currencyDescription', language)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* TIPS SECTION - Main tips display with sidebar */}
        <section className="tips-section">
          <div className="container">
            <div className="tips-layout">
              {/* Category Sidebar Filter */}
              <aside className="tips-sidebar">
                <h3>{getTranslation('categories', language)}</h3>
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

              {/* Tips Content Area - Displays tips matching selected category */}
              <div className="tips-content">
                {/* Header showing selected category and tip count */}
                <div className="tips-header">
                  <h2>{categories.find(c => c.id === selectedCategory)?.label || 'All'} Tips</h2>
                  <span className="tip-count">{filteredTips.length} tips</span>
                </div>

                {/* Tips List Container */}
                <div className="tips-list">
                  {/* Loading State - Show while fetching tips */}
                  {loading ? (
                    <div className="loading-state">
                      <BookOpen size={48} />
                      <p>{getTranslation('loading', language)}</p>
                    </div>
                  ) : filteredTips.length > 0 ? (
                    // Tip Cards - Each tip is expandable
                    filteredTips.map(tip => (
                      <article key={tip.id} className="tip-card">
                        {/* Tip Header - Clickable to expand/collapse */}
                        <div
                          className="tip-header"
                          onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                        >
                          <h4>{tip.title}</h4>
                          {/* Chevron icon rotates when expanded */}
                          <ChevronRight
                            size={20}
                            className={`chevron ${expandedTip === tip.id ? 'open' : ''}`}
                          />
                        </div>

                        {/* Expanded Content - Show only when tip is expanded */}
                        {expandedTip === tip.id && (
                          <div className="tip-content">
                            <p>{tip.content}</p>
                            <div className="tip-footer">
                              <span className="author">{getTranslation('by', language)} {tip.user_name}</span>
                              <span className="date">{new Date(tip.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}

                        {/* Excerpt - Show when tip is collapsed */}
                        {expandedTip !== tip.id && (
                          <p className="tip-excerpt">{tip.content.substring(0, 100)}...</p>
                        )}
                      </article>
                    ))
                  ) : (
                    // Empty State - No tips found in selected category
                    <div className="empty-state">
                      <BookOpen size={48} />
                      <p>{getTranslation('noTips', language)}</p>
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
              <h2>{getTranslation('readyForAdventure', language)}</h2>
              <p>{getTranslation('ctaDescription', language)}</p>
              <button 
                className="cta-button"
                onClick={() => navigate('/ai-planner?showForm=true')}
              >
                {getTranslation('startPlanning', language)}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default TravelTips;