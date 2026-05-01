import { Mail, Phone, MapPin, Share2, Heart } from 'lucide-react';
import { Facebook, Twitter, Instagram, Linkedin } from 'react-bootstrap-icons';
import React, { useState } from 'react';
import '../css/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [newsletter, setNewsletter] = useState({ email: '', loading: false, message: '' });
  
  const handleNewsletterChange = (e) => {
    setNewsletter({ ...newsletter, email: e.target.value });
    if (newsletter.message) setNewsletter(prev => ({ ...prev, message: '' }));
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletter.email || !newsletter.email.includes('@')) {
      setNewsletter(prev => ({ 
        ...prev, 
        message: { type: 'error', text: 'Please enter a valid email' }
      }));
      return;
    }

    setNewsletter(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletter.email,
          name: 'Newsletter Subscriber',
          phone: '',
          subject: 'Newsletter Subscription',
          message: 'User subscribed to newsletter'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletter({ 
          email: '', 
          loading: false, 
          message: { type: 'success', text: 'Thank you for subscribing!' }
        });
        setTimeout(() => {
          setNewsletter(prev => ({ ...prev, message: '' }));
        }, 3000);
      } else {
        setNewsletter(prev => ({ 
          ...prev, 
          loading: false,
          message: { type: 'error', text: data.error || 'Subscription failed. Please try again.' }
        }));
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletter(prev => ({ 
        ...prev, 
        loading: false,
        message: { type: 'error', text: 'Network error. Please try again.' }
      }));
    }
  };
 
  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    support: [
      { label: 'Contact Us', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Community', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Disclaimer', href: '#' },
    ],
    explore: [
      { label: 'Destinations', href: '#' },
      { label: 'AI Planner', href: '#' },
      { label: 'Travel Tips', href: '#' },
      { label: 'Reviews', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="footer-container">
          <div className="newsletter-content">
            <h3>Stay Updated with Travel Inspiration</h3>
            <p>Subscribe to our newsletter for exclusive deals and travel tips</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={newsletter.email}
                onChange={handleNewsletterChange}
                disabled={newsletter.loading}
                required
                className="newsletter-input"
              />
              <button 
                type="submit" 
                className="newsletter-btn"
                disabled={newsletter.loading}
              >
                {newsletter.loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {newsletter.message && (
              <div className={`newsletter-message ${newsletter.message.type}`}>
                {newsletter.message.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-section brand-section">
              <h3 className="footer-brand">🌍 TripWise</h3>
              <p className="footer-tagline">Discover authentic experiences and unforgettable journeys across Kenya.</p>
              
              {/* Social Links */}
              <div className="social-links">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a 
                      key={social.label}
                      href={social.href}
                      className="social-link"
                      aria-label={social.label}
                      title={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent size={20} className="social-icon" />
                    </a>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+254 794 178 635</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>wise.wiser254@gmail.com</span>
                </div>
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
            </div>

            {/* Quick Links Sections */}
            <div className="footer-section">
              <h4>Company</h4>
              <ul className="footer-links">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Support</h4>
              <ul className="footer-links">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Explore</h4>
              <ul className="footer-links">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <ul className="footer-links">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="copyright-section">
            <p>&copy; {currentYear} TripWise. All rights reserved.</p>
            <p className="footer-credit">Crafted with <span className="heart">❤️</span> for travel enthusiasts</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;