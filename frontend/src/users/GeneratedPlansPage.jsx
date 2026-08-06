import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './statics/navbar.jsx';
import Footer from './statics/footer.jsx';
import { CalendarDays, MapPin, Sparkles, ArrowLeft, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import { showErrorNotification } from '../utils/notificationUtils';
import './css/aiplanner.css';

const API_BASE = 'http://localhost:8000/api';

function GeneratedPlansPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setPlans([]);
      setLoading(false);
      return;
    }

    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_BASE}/trip-plans`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setPlans(data.data);
        } else {
          showErrorNotification(data.detail || 'Unable to load generated plans.');
        }
      } catch (error) {
        console.error('Error fetching generated plans:', error);
        showErrorNotification('Unable to load generated plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => new Date(b.created_at || b.start_date || 0) - new Date(a.created_at || a.start_date || 0));
  }, [plans]);

  return (
    <>
      <Navbar />
      <main className="aiplanner-page">
        <header className="page-header">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={20} /> {getTranslation('myTripPlans', language) || 'My Trip Plans'}
              </div>
              <h1>Generated Plans</h1>
              <p>Review, revisit, and manage the itineraries you created with TripWise.</p>
            </div>
          </div>
        </header>

        <section className="plans-section">
          <div className="container">
            <div className="plans-header">
              <div>
                <h2>Your generated plans</h2>
                <p className="muted">Browse every saved itinerary in one place.</p>
              </div>
              <button className="create-plan-btn" onClick={() => navigate('/ai-planner?showForm=true')}>
                <ArrowLeft size={16} /> Back to planner
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <Loader className="spin" size={28} />
                <p>Loading your plans...</p>
              </div>
            ) : sortedPlans.length === 0 ? (
              <div className="empty-state">
                <MapPin size={32} />
                <p>No generated plans yet. Create one from the AI planner to see it here.</p>
              </div>
            ) : (
              <div className="plans-grid">
                {sortedPlans.map((plan) => (
                  <article className="plan-card" key={plan.id}>
                    <h3>{plan.title || 'Untitled plan'}</h3>
                    <p>{plan.description || 'A thoughtfully crafted itinerary.'}</p>
                    <div className="plan-dates">
                      <CalendarDays size={14} />
                      <span>{plan.start_date || 'TBD'}{plan.end_date ? ` – ${plan.end_date}` : ''}</span>
                    </div>
                    <div className="plan-items">
                      {plan.items?.length ? (
                        <ul>
                          {plan.items.slice(0, 5).map((item, index) => (
                            <li key={`${plan.id}-${index}`}>
                              <strong>{item.title}</strong>
                              {item.date ? ` • ${item.date}` : ''}
                              {item.time ? ` • ${item.time}` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted">No itinerary items yet.</p>
                      )}
                    </div>
                    <div className="plan-actions">
                      <button className="btn-edit-plan" onClick={() => navigate(`/ai-planner?showForm=true&planId=${plan.id}`)}>
                        <Sparkles size={14} /> Open plan
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default GeneratedPlansPage;
