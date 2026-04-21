import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Zap, MapPin, Calendar, Users, Brain, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import './css/aiplanner.css';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered',
    description: 'Smart algorithms learn your preferences for personalized recommendations.',
  },
  {
    icon: Zap,
    title: 'Instant Planning',
    description: 'Get a complete itinerary in seconds, not hours.',
  },
  {
    icon: MapPin,
    title: 'Local Insights',
    description: 'Discover hidden gems and authentic local experiences.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Tell Us About You',
    description: 'Share your travel style, preferences, budget, and duration.',
  },
  {
    number: '2',
    title: 'AI Analyzes',
    description: 'Our AI considers thousands of factors to create your perfect plan.',
  },
  {
    number: '3',
    title: 'Get Your Itinerary',
    description: 'Receive a detailed day-by-day plan with activities and accommodations.',
  },
];

const planningStyles = [
  { id: 1, name: 'Adventure', emoji: '🏃' },
  { id: 2, name: 'Cultural', emoji: '🎭' },
  { id: 3, name: 'Luxury', emoji: '✨' },
  { id: 4, name: 'Budget', emoji: '🎒' },
  { id: 5, name: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 6, name: 'Romantic', emoji: '💑' },
];

function AIPlanner() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 'medium',
    travelers: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    console.log('Generating plan with:', { ...formData, style: selectedStyle });
  };

  return (
    <>
      <Navbar />

      <main className="aiplanner-page">
        {/* HERO SECTION */}
        <header className="page-header">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Brain size={20} /> AI-Powered Planning
              </div>
              <h1>Your Personal Travel Planner</h1>
              <p>Let AI create your perfect Kenyan adventure in seconds</p>
            </div>
          </div>
        </header>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose AI Planner?</h2>
            <div className="features-grid">
              {features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div key={idx} className="feature-card">
                    <div className="feature-icon">
                      <IconComponent size={32} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PLANNER FORM SECTION */}
        <section className="planner-section">
          <div className="container">
            <h2 className="section-title">Create Your Itinerary</h2>
            
            <div className="planner-layout">
              <form className="planner-form" onSubmit={handleGeneratePlan}>
                {/* Travel Style Selection */}
                <div className="form-group">
                  <label className="form-label">Choose Your Travel Style</label>
                  <div className="style-grid">
                    {planningStyles.map(style => (
                      <button
                        key={style.id}
                        type="button"
                        className={`style-option ${selectedStyle === style.id ? 'active' : ''}`}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <span className="style-emoji">{style.emoji}</span>
                        <span className="style-name">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <div className="input-group">
                    <MapPin size={18} />
                    <input
                      type="text"
                      name="destination"
                      placeholder="e.g., Nairobi, Masai Mara, Mombasa"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Duration & Budget */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Duration (days)</label>
                    <div className="input-group">
                      <Calendar size={18} />
                      <input
                        type="number"
                        name="days"
                        min="1"
                        max="30"
                        value={formData.days}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Budget</label>
                    <select name="budget" value={formData.budget} onChange={handleInputChange}>
                      <option value="budget">Budget (&lt; $50/day)</option>
                      <option value="medium">Medium ($50-150/day)</option>
                      <option value="luxury">Luxury (&gt; $150/day)</option>
                    </select>
                  </div>
                </div>

                {/* Travelers */}
                <div className="form-group">
                  <label className="form-label">Number of Travelers</label>
                  <div className="input-group">
                    <Users size={18} />
                    <input
                      type="number"
                      name="travelers"
                      min="1"
                      max="20"
                      value={formData.travelers}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button type="submit" className="generate-btn">
                  <Zap size={18} /> Generate My Itinerary
                </button>
              </form>

              {/* Info Box */}
              <div className="info-box">
                <div className="info-icon">
                  <Sparkles size={40} />
                </div>
                <h3>AI Magic in Action</h3>
                <p>Our advanced algorithms analyze:</p>
                <ul className="info-list">
                  <li>Popular attractions & hidden gems</li>
                  <li>Seasonal weather patterns</li>
                  <li>Travel times and distances</li>
                  <li>Local events and festivals</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="how-it-works">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              {steps.map((step, idx) => (
                <div key={idx} className="step-card">
                  <div className="step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Plan Your Adventure?</h2>
              <p>Start creating your personalized itinerary in less than a minute</p>
              <button className="cta-button">Get Started Now</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AIPlanner;