import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Zap, MapPin, Calendar, Users, Brain, Sparkles, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './css/aiplanner.css';

const API_BASE = 'http://localhost:8000/backend/api';

function AIPlanner() {
  const [tripPlans, setTripPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchTripPlans();
  }, []);

  const fetchTripPlans = async () => {
    try {
      // For demo, assume user is logged in with token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setTripPlans([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/aiPlanner.php`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.trip_plans) {
        setTripPlans(data.trip_plans);
      }
    } catch (error) {
      console.error('Error fetching trip plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/aiPlanner.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          items: [] // Empty for now
        })
      });
      const data = await response.json();
      if (data.message) {
        alert('Trip plan created successfully!');
        setFormData({ title: '', description: '', start_date: '', end_date: '' });
        setShowForm(false);
        fetchTripPlans();
      }
    } catch (error) {
      console.error('Error creating trip plan:', error);
    }
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

        {/* TRIP PLANS SECTION */}
        <section className="plans-section">
          <div className="container">
            <div className="plans-header">
              <h2 className="section-title">Your Trip Plans</h2>
              <button className="create-plan-btn" onClick={() => setShowForm(!showForm)}>
                <Plus size={20} /> Create New Plan
              </button>
            </div>

            {showForm && (
              <form className="create-plan-form" onSubmit={handleCreatePlan}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn">Create Plan</button>
              </form>
            )}

            <div className="plans-grid">
              {loading ? (
                <div className="loading-state">
                  <Brain size={48} />
                  <p>Loading your trip plans...</p>
                </div>
              ) : tripPlans.length > 0 ? (
                tripPlans.map(plan => (
                  <div key={plan.id} className="plan-card">
                    <h3>{plan.title}</h3>
                    <p>{plan.description}</p>
                    <div className="plan-dates">
                      <Calendar size={16} />
                      {plan.start_date && plan.end_date ? 
                        `${new Date(plan.start_date).toLocaleDateString()} - ${new Date(plan.end_date).toLocaleDateString()}` :
                        'Dates not set'
                      }
                    </div>
                    <div className="plan-items">
                      {plan.items && plan.items.length > 0 ? (
                        <ul>
                          {plan.items.map(item => (
                            <li key={item.id}>{item.title}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No items yet</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Brain size={48} />
                  <p>No trip plans yet. Create your first plan!</p>
                </div>
              )}
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