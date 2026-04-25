import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Zap, MapPin, Calendar, Users, Brain, Sparkles, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import './css/aiplanner.css';

const API_BASE = 'http://localhost:8000/api';

function AIPlanner() {
  const { language } = useLanguage();
  
  const [tripPlans, setTripPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [features, setFeatures] = useState([
    { icon: Zap, title: getTranslation('fastEfficient', language), description: getTranslation('generateTravelPlans', language) },
    { icon: MapPin, title: getTranslation('localInsights', language), description: getTranslation('discoverHiddenGems', language) },
    { icon: Calendar, title: getTranslation('smartScheduling', language), description: getTranslation('optimizeItinerary', language) },
    { icon: Users, title: getTranslation('personalizedExperience', language), description: getTranslation('tailoredRecommendations', language) }
  ]);
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
                <Brain size={20} /> {getTranslation('aiPlanner', language)}
              </div>
              <h1>{getTranslation('myTripPlans', language)}</h1>
              <p>{getTranslation('startPlanningYourTrip', language)}</p>
            </div>
          </div>
        </header>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">{getTranslation('getRecommendations', language)}</h2>
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
              <h2 className="section-title">{getTranslation('myTripPlans', language)}</h2>
              <button className="create-plan-btn" onClick={() => setShowForm(!showForm)}>
                <Plus size={20} /> {getTranslation('createNewPlan', language)}
              </button>
            </div>

            {showForm && (
              <form className="create-plan-form" onSubmit={handleCreatePlan}>
                <div className="form-group">
                  <label>{getTranslation('planTitle', language)}</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{getTranslation('planDescription', language)}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{getTranslation('startDate', language)}</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{getTranslation('endDate', language)}</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn">{getTranslation('createPlan', language)}</button>
              </form>
            )}

            <div className="plans-grid">
              {loading ? (
                <div className="loading-state">
                  <Brain size={48} />
                  <p>{getTranslation('loading', language)}</p>
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
                        getTranslation('noPlans', language)
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
                        <p>{getTranslation('noPlans', language)}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Brain size={48} />
                  <p>{getTranslation('startPlanningYourTrip', language)}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>{getTranslation('planYourTrip', language)}</h2>
              <p>{getTranslation('startPlanningYourTrip', language)}</p>
              <button className="cta-button">{getTranslation('createNewPlan', language)}</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AIPlanner;