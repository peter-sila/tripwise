import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, User, Globe, LogIn, LogOut, Loader, MapPin, Tag } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../utils/translations';
import ProfileModal from './ProfileModal';
import '../css/navbar.css';

const API_BASE = 'http://localhost:8000/api';

const NavBar = () => {
  const { language, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });
  const [showUserMenu, setShowUserMenu] = useState(false); // For user profile dropdown
  const [showLanguageMenu, setShowLanguageMenu] = useState(false); // For language selector
  const [showProfileModal, setShowProfileModal] = useState(false); // For profile modal
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const languageMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        // Don't close if clicking very close to the input
        setTimeout(() => setShowSearchResults(false), 100);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    // Debounce the search request by 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/destinations/search?query=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          // Limit results to 8 for dropdown
          setSearchResults(data.data.slice(0, 8));
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchResultClick = (destination) => {
    // Navigate to destination or show details
    window.location.href = `/?destination=${destination.id}`;
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      // Navigate to discover page with search query
      window.location.href = `/discover?search=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
    const body = authMode === 'login' 
      ? { email: authData.email, password: authData.password }
      : { email: authData.email, password: authData.password, name: authData.name };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      
      // Handle successful response with token
      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setUser(data.user);
        setShowAuth(false);
        setAuthData({ email: '', password: '', name: '' });
        alert(getTranslation('loginSuccess', language));
        
        // Redirect to admin dashboard if user is admin
        if (data.user && data.user.is_admin) {
          localStorage.setItem('adminInfo', JSON.stringify(data.user));
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 500);
        }
      } 
      // Handle error response
      else if (data.detail) {
        alert(`Error: ${data.detail}`);
      }
      // Handle other error messages
      else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(getTranslation('loginError', language));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminInfo');
    setUser(null);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_token: credentialResponse.credential
        })
      });
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setUser(data.user);
        setShowAuth(false);
        setAuthData({ email: '', password: '', name: '' });
        alert(getTranslation('loginSuccess', language));
        
        // Redirect to admin dashboard if user is admin
        if (data.user && data.user.is_admin) {
          localStorage.setItem('adminInfo', JSON.stringify(data.user));
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 500);
        }
      } else if (data.detail) {
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Google auth error:', error);
      alert(getTranslation('loginError', language));
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    alert('Google Sign-In failed. Please try again.');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    setShowLanguageMenu(false);
  };

  const navLinks = [
    { label: getTranslation('destinations', language), href: '/' },
    { label: getTranslation('discover', language), href: '/discover' },
    { label: getTranslation('aiPlanner', language), href: '/ai-planner' },
    { label: getTranslation('travelTips', language), href: '/travel-tips' },
    { label: getTranslation('reviews', language), href: '/reviews' },
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
            aria-label={getTranslation('search', language)}
          >
            <Search size={20} />
          </button>

          {/* Language Selector */}
          <div className="language-menu-container" ref={languageMenuRef}>
            <button 
              className="nav-icon-btn language-btn"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              aria-label={getTranslation('selectLanguage', language)}
              title={getTranslation('selectLanguage', language)}
            >
              <Globe size={20} />
            </button>

            {/* Language Dropdown Menu */}
            {showLanguageMenu && (
              <div className="language-dropdown-menu">
                <div className="language-dropdown-header">{getTranslation('selectLanguage', language)}</div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-item ${language === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="language-flag">{lang.flag}</span>
                    <span className="language-name">{lang.name}</span>
                    {language === lang.code && <span className="language-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account */}
          {user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                className="user-profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <User size={20} />
                <span className="user-name">Hi, {user.name}</span>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <button 
                    className="dropdown-item profile-link"
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowUserMenu(false);
                    }}
                  >
                    <User size={16} />
                    {getTranslation('profile', language)}
                  </button>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut size={16} />
                    {getTranslation('logout', language)}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="join-us-btn"
              onClick={() => setShowAuth(!showAuth)}
              aria-label={getTranslation('joinUs', language)}
            >
              {getTranslation('joinUs', language)}
            </button>
          )}

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

      {/* Auth Modal */}
      {showAuth && (
        <div className="auth-modal">
          <div className="auth-container">
            <button className="auth-close" onClick={() => setShowAuth(false)}>×</button>
            <h3>{authMode === 'login' ? getTranslation('login', language) : getTranslation('register', language)}</h3>
            <form onSubmit={handleAuth}>
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder={getTranslation('name', language)}
                  value={authData.name}
                  onChange={(e) => setAuthData({...authData, name: e.target.value})}
                  required
                />
              )}
              <input
                type="email"
                placeholder={getTranslation('email', language)}
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder={getTranslation('password', language)}
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                required
              />
              <button type="submit">{authMode === 'login' ? getTranslation('login', language) : getTranslation('register', language)}</button>
            </form>

            {/* Google Sign-In */}
            <div className="auth-divider">
              <span>{getTranslation('orContinueWith', language)}</span>
            </div>
            <div className="google-signin-container">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text={authMode === 'login' ? 'signin_with' : 'signup_with'}
                locale={language}
              />
            </div>

            <button 
              className="auth-switch" 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? getTranslation('needAccount', language) : getTranslation('haveAccount', language)}
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="navbar-search">
          <div className="navbar-container">
            <form onSubmit={handleSearchSubmit} className="search-form-container">
              <div className="search-input-wrapper" ref={searchInputRef}>
                <Search size={18} className="search-icon-input" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="search-input" 
                  placeholder={getTranslation('searchPlaceholder', language)}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(e);
                    }
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                  >
                    ×
                  </button>
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="search-results-dropdown">
                    {isSearching && (
                      <div className="search-loading">
                        <Loader size={18} className="spinner" />
                        <span>{getTranslation('loading', language)}</span>
                      </div>
                    )}
                    
                    {!isSearching && searchResults.length > 0 && (
                      <>
                        <div className="search-results-list">
                          {searchResults.map((destination) => (
                            <button
                              key={destination.id}
                              className="search-result-item"
                              onClick={() => handleSearchResultClick(destination)}
                            >
                              <div className="result-icon">
                                {destination.image_url ? (
                                  <img 
                                    src={destination.image_url} 
                                    alt={destination.name}
                                    className="result-image"
                                  />
                                ) : (
                                  <MapPin size={16} />
                                )}
                              </div>
                              <div className="result-content">
                                <div className="result-name">{destination.name}</div>
                                <div className="result-location">{destination.location}</div>
                              </div>
                              {destination.category && (
                                <div className="result-category">
                                  <Tag size={12} />
                                  {destination.category}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {searchResults.length > 0 && (
                          <button
                            className="search-results-footer"
                            onClick={() => handleSearchSubmit()}
                          >
                            {getTranslation('seeAll', language) || 'See all results'}
                          </button>
                        )}
                      </>
                    )}
                    
                    {!isSearching && searchQuery.trim().length > 0 && searchResults.length === 0 && (
                      <div className="search-no-results">
                        <span>{getTranslation('noResults', language)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
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

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onLogout={handleLogout}
      />
    </nav>
  );
};

export default NavBar;