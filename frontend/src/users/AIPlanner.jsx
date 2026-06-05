import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Zap, MapPin, Calendar, Users, Brain, Sparkles, Plus, Send, Bell, Download, Edit2, Trash2, Loader } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import './css/aiplanner.css';
import SessionExpiredModal from './statics/SessionExpiredModal.jsx';

const API_BASE = 'http://localhost:8000/api';

function AIPlanner() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const [tripPlans, setTripPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('showForm') === 'true');
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const features = [
    { icon: Zap, title: getTranslation('fastEfficient', language), description: getTranslation('generateTravelPlans', language) },
    { icon: MapPin, title: getTranslation('localInsights', language), description: getTranslation('discoverHiddenGems', language) },
    { icon: Calendar, title: getTranslation('smartScheduling', language), description: getTranslation('optimizeItinerary', language) },
    { icon: Users, title: getTranslation('personalizedExperience', language), description: getTranslation('tailoredRecommendations', language) }
  ];
  
  // AI Questionnaire Form State
  const [aiFormData, setAiFormData] = useState({
    destination: '',
    duration_days: '5',
    start_date: '',
    budget: 'moderate',
    travel_style: 'balanced',
    group_size: '2',
    interests: ['sightseeing', 'local cuisine'],
    accommodation: 'hotel'
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const [itemFormData, setItemFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  });
  const [tripItems, setTripItems] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionMessage, setSessionMessage] = useState('');
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleAiInputChange = (e) => {
    const { name, value } = e.target;
    setAiFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthError = (data, response) => {
    const detail = data && data.detail ? String(data.detail).toLowerCase() : '';
    const isAuthError = (response && response.status === 401) || detail.includes('invalid or expired token') || detail.includes('token is invalid') || detail.includes('token expired');
    if (isAuthError) {
      // Clear stored token and notify user, then open auth popup
      try {
        localStorage.removeItem('token');
      } catch (e) {
        console.warn('Unable to clear token from localStorage:', e);
      }
      const msg = getTranslation('sessionExpired', language) || 'Session expired. Please log in again.';
      setSessionMessage(msg);
      setShowSessionModal(true);
      // Auto-redirect to login after short delay; user can also click the modal button
      setTimeout(() => { window.dispatchEvent(new CustomEvent('openAuth', { detail: { mode: 'login' } })); }, 1500);
      return true;
    }
    return false;
  };

  const handleGenerateWithAI = async (e) => {
    e && e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      // Show login popup instead of just setting error
      setShowLoginPopup(true);
      return;
    }

    // minimal validation
    if (!aiFormData.destination || !aiFormData.duration_days) {
      setFormMessage(getTranslation('aiFormRequired', language) || 'Destination and duration are required');
      return;
    }

    setGeneratingPlan(true);
    setFormMessage('');

    try {
      const tokenForLog = token || 'no-token';
      console.debug('AI generate token:', tokenForLog);

      const response = await fetch(`${API_BASE}/trip-plans/generate-with-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...aiFormData, auto_save: true })
      });

      const data = await response.json();
      if (handleAuthError(data, response)) return;
      if (response.ok && data.data) {
        // add saved plan to plans list
        setTripPlans(prev => [data.data, ...prev]);
        setFormMessage(getTranslation('tripPlanCreated', language) || 'Trip plan created successfully');
        // reset ai form
        setAiFormData({ destination: '', duration_days: '5', start_date: '', budget: 'moderate', travel_style: 'balanced', group_size: '2', interests: ['sightseeing', 'local cuisine'], accommodation: 'hotel' });
        setTimeout(() => setFormMessage(''), 3000);
      } else {
        setFormMessage(data.detail || data.error || getTranslation('messageError', language));
      }
    } catch (err) {
      console.error('AI generate error', err);
      setFormMessage(getTranslation('messageError', language));
    } finally {
      setGeneratingPlan(false);
    }
  };

  async function fetchTripPlans() {
    try {
      // For demo, assume user is logged in with token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setTripPlans([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/trip-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (handleAuthError(data, response)) return;
      if (data.data && Array.isArray(data.data)) {
        setTripPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching trip plans:', error);
    } finally {
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    // Load saved trip plans on mount.
    fetchTripPlans();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemFormData.title.trim()) {
      alert(getTranslation('itemTitleRequired', language) || 'Item title is required');
      return;
    }

    const newItem = {
      id: Date.now(),
      title: itemFormData.title.trim(),
      description: itemFormData.description.trim(),
      date: itemFormData.date,
      time: itemFormData.time
    };

    setTripItems([...tripItems, newItem]);
    setItemFormData({ title: '', description: '', date: '', time: '' });
  };

  const handleRemoveItem = (itemId) => {
    setTripItems(tripItems.filter(item => item.id !== itemId));
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactMessage('');

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: contactFormData.name,
          email: contactFormData.email,
          phone: contactFormData.phone,
          subject: contactFormData.subject,
          message: contactFormData.message
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Show success modal instead of just a message
        setShowContactSuccess(true);
        setContactFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        // Auto-close after 8 seconds
        setTimeout(() => setShowContactSuccess(false), 8000);
      } else {
        setContactMessage(data.detail || getTranslation('messageError', language));
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setContactMessage(getTranslation('messageError', language));
    } finally {
      setContactLoading(false);
    }
  };

  const handleAddToCalendar = (plan) => {
    // Generate iCal format for calendar download
    const startDate = new Date(plan.start_date);
    const endDate = new Date(plan.end_date);
    
    // Format dates to iCal format (YYYYMMDD)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };
    
    // Format datetime to iCal format (YYYYMMDDTHHMMSSZ)
    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };
    
    // Create iCal content
    const now = new Date();
    const calendarContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TripWise//Travel Planning//EN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
DTSTAMP:${formatDateTime(now)}
UID:tripwise-${plan.id}@tripwise.com
CREATED:${formatDateTime(now)}
DESCRIPTION:${plan.description || 'Trip Plan'}
LAST-MODIFIED:${formatDateTime(now)}
LOCATION:${getTranslation('myTripPlans', language)}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${plan.title}
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

    // Create blob and download
    const blob = new Blob([calendarContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${plan.title}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm(getTranslation('confirmDelete', language) || 'Are you sure you want to delete this plan?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert(getTranslation('loginError', language));
      return;
    }

    setDeleteLoading(planId);
    try {
      const response = await fetch(`${API_BASE}/trip-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (handleAuthError(data, response)) return;
      if (response.ok) {
        setTripPlans(tripPlans.filter(plan => plan.id !== planId));
      } else {
        alert(data.detail || getTranslation('errorDeletingPlan', language) || 'Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting trip plan:', error);
      alert(getTranslation('errorDeletingPlan', language) || 'Failed to delete plan');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditPlan = (plan) => {
    setFormData({
      title: plan.title,
      description: plan.description || '',
      start_date: plan.start_date,
      end_date: plan.end_date
    });
    setEditingPlanId(plan.id);
    setTripItems(plan.items || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setFormMessage(getTranslation('loginError', language));
      return;
    }

    // Validation checks
    if (!formData.title.trim()) {
      setFormMessage(getTranslation('planTitleRequired', language) || 'Plan title is required');
      return;
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        setFormMessage(getTranslation('endDateAfterStart', language) || 'End date must be after start date');
        return;
      }

      // Check if dates are in the past (only for new plans, not edits)
      if (!editingPlanId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
          setFormMessage(getTranslation('futureDateRequired', language) || 'Start date must be in the future');
          return;
        }
      }
    }

    setFormLoading(true);
    setFormMessage('');

    try {
      const method = editingPlanId ? 'PUT' : 'POST';
      const url = editingPlanId ? `${API_BASE}/trip-plans/${editingPlanId}` : `${API_BASE}/trip-plans`;
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          start_date: formData.start_date,
          end_date: formData.end_date,
          items: tripItems.map(item => ({
            title: item.title,
            description: item.description,
            date: item.date || null,
            time: item.time || null
          }))
        })
      });
      const data = await response.json();
      if (handleAuthError(data, response)) return;
      if (data.message || data.success) {
        const successMessage = editingPlanId 
          ? (getTranslation('tripPlanUpdated', language) || 'Trip plan updated successfully!')
          : getTranslation('tripPlanCreated', language);
        setFormMessage(successMessage);
        setFormData({ title: '', description: '', start_date: '', end_date: '' });
        setTripItems([]);
        setItemFormData({ title: '', description: '', date: '', time: '' });
        setEditingPlanId(null);
        setTimeout(() => {
          setShowForm(false);
          setFormMessage('');
          fetchTripPlans();
        }, 2000);
      } else if (data.error) {
        setFormMessage(data.error);
      } else {
        setFormMessage(getTranslation('errorCreatingPlan', language));
      }
    } catch (error) {
      console.error('Error creating trip plan:', error);
      setFormMessage(getTranslation('errorCreatingPlan', language));
    } finally {
      setFormLoading(false);
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

        {/* AI GENERATOR FORM */}
        <section className="ai-generator-section">
          <div className="container">
            <div className="ai-generator-card">
              <h2>{getTranslation('aiPlanner', language)}</h2>
              <p>{getTranslation('aiPlannerIntro', language) || 'Tell us the destination and duration, and we will generate an itinerary for you.'}</p>
              <form className="ai-generator-form" onSubmit={handleGenerateWithAI}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ai-destination">{getTranslation('destination', language) || 'Destination'}</label>
                    <input id="ai-destination" name="destination" value={aiFormData.destination} onChange={handleAiInputChange} placeholder={getTranslation('destination', language) || 'e.g., Kyoto, Japan'} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ai-duration">{getTranslation('durationDays', language) || 'Duration (days)'}</label>
                    <input id="ai-duration" name="duration_days" type="number" min="1" value={aiFormData.duration_days} onChange={handleAiInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ai-budget">{getTranslation('budget', language) || 'Budget'}</label>
                    <select id="ai-budget" name="budget" value={aiFormData.budget} onChange={handleAiInputChange}>
                      <option value="budget">{getTranslation('budgetLow', language) || 'Budget'}</option>
                      <option value="moderate">{getTranslation('budgetMedium', language) || 'Moderate'}</option>
                      <option value="luxury">{getTranslation('budgetHigh', language) || 'Luxury'}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ai-travel-style">{getTranslation('travelStyle', language) || 'Travel style'}</label>
                    <select id="ai-travel-style" name="travel_style" value={aiFormData.travel_style} onChange={handleAiInputChange}>
                      <option value="balanced">{getTranslation('balanced', language) || 'Balanced'}</option>
                      <option value="adventure">{getTranslation('adventure', language) || 'Adventure'}</option>
                      <option value="relaxation">{getTranslation('relaxation', language) || 'Relaxation'}</option>
                      <option value="cultural">{getTranslation('cultural', language) || 'Cultural'}</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-generate" disabled={generatingPlan}>
                    {generatingPlan ? (getTranslation('generating', language) || 'Generating...') : (getTranslation('generateAndSave', language) || 'Generate & Save')}
                  </button>
                  {formMessage && <span className="ai-form-message">{formMessage}</span>}
                </div>
              </form>
            </div>
          </div>
        </section>

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

        {/* OUR STORY SECTION */}
        <section className="our-story-section">
          <div className="container">
            <div className="story-grid">
              {/* Left Side - Story Content */}
              <div className="story-content">
                <div className="story-badge">
                  <Sparkles size={18} /> {getTranslation('ourStory', language)}
                </div>
                <h2>{getTranslation('ourStoryTitle', language)}</h2>
                <p className="story-main-text">{getTranslation('ourStoryText', language)}</p>
                
                <div className="mission-box">
                  <h3>{getTranslation('ourMission', language)}</h3>
                  <p>{getTranslation('ourMissionText', language)}</p>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="contact-form-container">
                <h3>{getTranslation('contact', language)}</h3>
                <p className="contact-description">{getTranslation('contactMessage', language)}</p>
                
                {contactMessage && (
                  <div className={`form-message ${contactMessage.includes('success') || contactMessage === getTranslation('messageSent', language) ? 'success' : 'error'}`}>
                    {contactMessage}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="contact-name">{getTranslation('fullName', language)}</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      required
                      placeholder={getTranslation('fullName', language)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email">{getTranslation('email', language)}</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleContactInputChange}
                      required
                      placeholder={getTranslation('email', language)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-phone">{getTranslation('phoneNumber', language)}</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={contactFormData.phone}
                      onChange={handleContactInputChange}
                      placeholder={getTranslation('phoneNumber', language)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject">{getTranslation('subject', language)}</label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={contactFormData.subject}
                      onChange={handleContactInputChange}
                      required
                      placeholder={getTranslation('subject', language)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">{getTranslation('messageLabel', language)}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={contactFormData.message}
                      onChange={handleContactInputChange}
                      required
                      rows="4"
                      placeholder={getTranslation('messageLabel', language)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="contact-submit-btn"
                    disabled={contactLoading}
                  >
                    <Send size={18} />
                    {contactLoading ? getTranslation('sending', language) : getTranslation('send', language)}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>{getTranslation('planYourTrip', language)}</h2>
              <p>{getTranslation('startPlanningYourTrip', language)}</p>
              <button className="cta-button" onClick={() => setShowForm(!showForm)}>{getTranslation('createNewPlan', language)}</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SessionExpiredModal
        isOpen={showSessionModal}
        message={sessionMessage}
        onClose={() => setShowSessionModal(false)}
        onLogin={() => {
          try {
            localStorage.removeItem('token');
          } catch (e) {
            console.warn('Unable to clear token from localStorage:', e);
          }
          window.dispatchEvent(new CustomEvent('openAuth', { detail: { mode: 'login' } }));
        }}
      />
      
      {/* Contact Success Modal */}
      {showContactSuccess && (
        <div className="contact-success-modal">
          <div className="success-modal-backdrop" onClick={() => setShowContactSuccess(false)}></div>
          <div className="success-modal-content">
            <div className="success-modal-header">
              <h2>{getTranslation('messageSent', language)}</h2>
            </div>
            <div className="success-modal-body">
              <div className="success-icon">✓</div>
              <p>{getTranslation('messageSent', language)}</p>
              <p className="success-subtext">Thank you for reaching out! We'll get back to you soon.</p>
              {!localStorage.getItem('token') && (
                <div className="success-register-link">
                  <p>Don't have an account yet?</p>
                  <button 
                    className="register-btn"
                    onClick={() => {
                      setShowContactSuccess(false);
                      window.dispatchEvent(new CustomEvent('openAuth', { detail: { mode: 'register' } }));
                    }}
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
            <button 
              className="success-modal-close"
              onClick={() => setShowContactSuccess(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Login Popup for AI Planner */}
      {showLoginPopup && (
        <div className="login-popup-modal">
          <div className="login-popup-backdrop" onClick={() => setShowLoginPopup(false)}></div>
          <div className="login-popup-content">
            <button 
              className="login-popup-close"
              onClick={() => setShowLoginPopup(false)}
            >
              ×
            </button>
            <div className="login-popup-header">
              <h2>{getTranslation('login', language)}</h2>
              <p>Login to create your personalized travel plan</p>
            </div>
            <button 
              className="login-popup-btn"
              onClick={() => {
                setShowLoginPopup(false);
                window.dispatchEvent(new CustomEvent('openAuth', { detail: { mode: 'login' } }));
              }}
            >
              Go to Login
            </button>
            <button 
              className="register-popup-btn"
              onClick={() => {
                setShowLoginPopup(false);
                window.dispatchEvent(new CustomEvent('openAuth', { detail: { mode: 'register' } }));
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIPlanner;