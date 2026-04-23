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
import './css/traveltips.css';

// API base URL for backend requests
const API_BASE = 'http://localhost:8000/api';

/**
 * Available tip categories
 * Each category has an ID, label, and emoji icon for visual identification
 */
const categories = [
  { id: '', label: 'All', icon: '📚' },           // Show all tips
  { id: 'packing', label: 'Packing', icon: '🎒' },     // What to pack
  { id: 'safety', label: 'Safety', icon: '🛡️' },       // Safety advice
  { id: 'budget', label: 'Budget', icon: '💰' },       // Money-saving tips
  { id: 'health', label: 'Health', icon: '💊' },       // Health considerations
  { id: 'culture', label: 'Culture', icon: '🎭' },     // Cultural etiquette
  { id: 'transport', label: 'Transport', icon: '🚗' },  // Transportation info
];

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
  // Data state
  const [tips, setTips] = useState([]);                   // All tips from API
  const [loading, setLoading] = useState(true);           // Loading indicator
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(''); // Active category filter
  const [expandedTip, setExpandedTip] = useState(null);    // Currently expanded tip

  /**
   * Effect Hook: Fetch tips when category changes
   * 
   * Fetches travel tips whenever user selects a different category.
   * Dependency: selectedCategory - triggers fetch when category ID changes
   */
  useEffect(() => {
    fetchTips();
  }, [selectedCategory]);

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
  const fetchTips = async () => {
    setLoading(true);
    try {
      // Build API URL based on selected category
      const url = selectedCategory 
        ? `${API_BASE}/travelTips.php?category=${selectedCategory}` 
        : `${API_BASE}/travelTips.php`;
      
      // Fetch tips from backend
      const response = await fetch(url);
      const data = await response.json();
      
      // Update state with fetched tips or empty array
      if (data.travel_tips && data.travel_tips.length > 0) {
        setTips(data.travel_tips);
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
  };

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
              <h1>Travel Tips & Guides</h1>
              <p>Expert advice to make your Kenya trip unforgettable</p>
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

        {/* TIPS SECTION - Main tips display with sidebar */}
        <section className="tips-section">
          <div className="container">
            <div className="tips-layout">
              {/* Category Sidebar Filter */}
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
                      <p>Loading tips...</p>
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
                              <span className="author">By {tip.user_name}</span>
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