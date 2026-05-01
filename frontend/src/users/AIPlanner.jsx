import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { Zap, MapPin, Calendar, Users, Brain, Sparkles, Plus, Send, Bell, Download, Edit2, Trash2, Loader } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import './css/aiplanner.css';

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
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const [features, setFeatures] = useState([
    { icon: Zap, title: getTranslation('fastEfficient', language), description: getTranslation('generateTravelPlans', language) },
    { icon: MapPin, title: getTranslation('localInsights', language), description: getTranslation('discoverHiddenGems', language) },
    { icon: Calendar, title: getTranslation('smartScheduling', language), description: getTranslation('optimizeItinerary', language) },
    { icon: Users, title: getTranslation('personalizedExperience', language), description: getTranslation('tailoredRecommendations', language) }
  ]);
  
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
  const [selectedInterests, setSelectedInterests] = useState(['sightseeing', 'local cuisine']);
  
  const availableInterests = [
    'sightseeing',
    'adventure',
    'local cuisine',
    'cultural experiences',
    'beaches',
    'hiking',
    'shopping',
    'nightlife',
    'museums',
    'photography'
  ];

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

      const response = await fetch(`${API_BASE}/trip-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setTripPlans(data.data);
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
        setContactMessage(getTranslation('messageSent', language));
        setContactFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        // Clear success message after 5 seconds
        setTimeout(() => setContactMessage(''), 5000);
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
              <div>
                <h2 className="section-title">{getTranslation('myTripPlans', language)}</h2>
              </div>
              <button className="create-plan-btn" onClick={() => setShowForm(!showForm)}>
                <Plus size={20} /> {getTranslation('createNewPlan', language)}
              </button>
            </div>

            {showForm && (
              <div className="create-plan-card">
                <div className="form-header">
                  <h3>{editingPlanId ? getTranslation('editPlan', language) || 'Edit Plan' : getTranslation('createNewPlan', language)}</h3>
                  <button 
                    type="button"
                    className="form-close-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPlanId(null);
                      setFormData({ title: '', description: '', start_date: '', end_date: '' });
                      setTripItems([]);
                      setItemFormData({ title: '', description: '', date: '', time: '' });
                      setFormMessage('');
                    }}
                  >
                    ×
                  </button>
                </div>

                {formMessage && (
                  <div className={`form-message ${formMessage.includes('success') || formMessage === getTranslation('tripPlanCreated', language) || formMessage === getTranslation('tripPlanUpdated', language) ? 'success' : 'error'}`}>
                    {formMessage}
                  </div>
                )}

                <form className="create-plan-form" onSubmit={handleCreatePlan}>
                  <div className="form-group">
                    <label htmlFor="plan-title">{getTranslation('planTitle', language)}</label>
                    <input
                      id="plan-title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder={getTranslation('planTitle', language)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="plan-description">{getTranslation('planDescription', language)}</label>
                    <textarea
                      id="plan-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={getTranslation('planDescription', language)}
                      rows="4"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="plan-start-date">{getTranslation('startDate', language)}</label>
                      <input
                        id="plan-start-date"
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="plan-end-date">{getTranslation('endDate', language)}</label>
                      <input
                        id="plan-end-date"
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Trip Items Section */}
                  <div className="trip-items-section">
                    <h4 className="items-section-title">{getTranslation('addActivities', language) || 'Add Activities (Optional)'}</h4>
                    
                    {/* Existing Items List */}
                    {tripItems.length > 0 && (
                      <div className="items-list">
                        {tripItems.map(item => (
                          <div key={item.id} className="item-card">
                            <div className="item-content">
                              <p className="item-title">{item.title}</p>
                              {item.description && <p className="item-description">{item.description}</p>}
                              {item.date && <p className="item-date">{item.date} {item.time ? `at ${item.time}` : ''}</p>}
                            </div>
                            <button
                              type="button"
                              className="btn-remove-item"
                              onClick={() => handleRemoveItem(item.id)}
                              title={getTranslation('remove', language) || 'Remove'}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Item Form */}
                    <form className="add-item-form" onSubmit={handleAddItem}>
                      <div className="form-group">
                        <input
                          type="text"
                          name="title"
                          value={itemFormData.title}
                          onChange={handleItemInputChange}
                          placeholder={getTranslation('activityTitle', language) || 'Activity title'}
                          className="item-input"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <input
                            type="date"
                            name="date"
                            value={itemFormData.date}
                            onChange={handleItemInputChange}
                            className="item-input"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="time"
                            name="time"
                            value={itemFormData.time}
                            onChange={handleItemInputChange}
                            className="item-input"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="description"
                          value={itemFormData.description}
                          onChange={handleItemInputChange}
                          placeholder={getTranslation('activityDescription', language) || 'Activity description (optional)'}
                          className="item-input"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn-add-item"
                      >
                        <Plus size={16} /> {getTranslation('addActivity', language) || 'Add Activity'}
                      </button>
                    </form>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowForm(false);
                        setEditingPlanId(null);
                        setFormData({ title: '', description: '', start_date: '', end_date: '' });
                        setTripItems([]);
                        setItemFormData({ title: '', description: '', date: '', time: '' });
                        setFormMessage('');
                      }}
                      disabled={formLoading}
                    >
                      {getTranslation('cancel', language)}
                    </button>
                    <button 
                      type="submit" 
                      className="btn-submit"
                      disabled={formLoading}
                    >
                      {formLoading ? 
                        (editingPlanId ? getTranslation('updating', language) || 'Updating...' : getTranslation('creating', language)) 
                        : (editingPlanId ? getTranslation('updatePlan', language) || 'Update Plan' : getTranslation('createPlan', language))
                      }
                    </button>
                  </div>
                </form>
              </div>
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
                    <div className="plan-actions">
                      <button 
                        className="btn-add-calendar"
                        onClick={() => handleAddToCalendar(plan)}
                        title={getTranslation('addToCalendar', language)}
                      >
                        <Download size={16} />
                        {getTranslation('addToCalendar', language)}
                      </button>
                      <button 
                        className="btn-edit-plan"
                        onClick={() => handleEditPlan(plan)}
                        title={getTranslation('edit', language) || 'Edit'}
                        disabled={deleteLoading === plan.id}
                      >
                        <Edit2 size={16} />
                        {getTranslation('edit', language) || 'Edit'}
                      </button>
                      <button 
                        className="btn-delete-plan"
                        onClick={() => handleDeletePlan(plan.id)}
                        title={getTranslation('delete', language) || 'Delete'}
                        disabled={deleteLoading === plan.id}
                      >
                        <Trash2 size={16} />
                        {deleteLoading === plan.id ? getTranslation('deleting', language) || 'Deleting...' : getTranslation('delete', language) || 'Delete'}
                      </button>
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
    </>
  );
}

export default AIPlanner;