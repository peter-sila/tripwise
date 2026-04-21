import { useState } from 'react';
import { Menu, X, Search, User, Globe } from 'lucide-react';
import '../css/navbar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const navLinks = [
    { label: 'Destinations', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'AI Planner', href: '/ai-planner' },
    { label: 'Travel Tips', href: '/travel-tips' },
    { label: 'Reviews', href: '/reviews' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-brand">
          <span className="logo-icon">🌍</span>
          <span className="brand-text">TripWise</span>
        </a>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="navbar-actions">
          {/* Search */}
          <button 
            className="nav-icon-btn search-btn"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Language Selector */}
          <button className="nav-icon-btn" aria-label="Language">
            <Globe size={20} />
          </button>

          {/* User Account */}
          <button className="nav-icon-btn" aria-label="User Account">
            <User size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="nav-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="navbar-search">
          <div className="navbar-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search destinations, activities, restaurants..."
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="nav-links-mobile">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="nav-link-mobile"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;