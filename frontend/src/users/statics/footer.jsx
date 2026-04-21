import { Mail, Phone, MapPin, Share2, Heart } from 'lucide-react';
import '../css/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    { emoji: '👍', href: '#', label: 'Facebook' },
    { emoji: '𝕏', href: '#', label: 'Twitter' },
    { emoji: '📷', href: '#', label: 'Instagram' },
    { emoji: '💼', href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="footer-container">
          <div className="newsletter-content">
            <h3>Stay Updated with Travel Inspiration</h3>
            <p>Subscribe to our newsletter for exclusive deals and travel tips</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
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
                {socialLinks.map((social) => (
                  <a 
                    key={social.label}
                    href={social.href}
                    className="social-link"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <span className="social-emoji">{social.emoji}</span>
                  </a>
                ))}
              </div>

              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+254 (0) 123 456 789</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>support@tripwise.com</span>
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