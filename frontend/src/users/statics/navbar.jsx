import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, User, Globe, LogIn, LogOut } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../utils/translations';
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
  const languageMenuRef = useRef(null);
  const userMenuRef = useRef(null);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? 'auth.php' : 'auth.php';
    const body = authMode === 'login' 
      ? { action: 'login', email: authData.email, password: authData.password }
      : { action: 'register', email: authData.email, password: authData.password, name: authData.name };

    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      
      // Handle successful response with token
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setShowAuth(false);
        setAuthData({ email: '', password: '', name: '' });
        alert(getTranslation('loginSuccess', language));
      } 
      // Handle error response
      else if (data.error) {
        alert(`Error: ${data.error}`);
      }
      // Handle registration success (returns user_id instead of token)
      else if (data.user_id && authMode === 'register') {
        alert(getTranslation('registerSuccess', language));
        setAuthMode('login');
        setAuthData({ email: authData.email, password: authData.password, name: '' });
      }
      // Handle other success messages
      else if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(getTranslation('loginError', language));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_BASE}/google-auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'google_signin',
          id_token: credentialResponse.credential
        })
      });
      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setShowAuth(false);
        setAuthData({ email: '', password: '', name: '' });
        alert(getTranslation('loginSuccess', language));
      } else if (data.error) {
        alert(`Error: ${data.error}`);
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
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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
                  <a href="/profile" className="dropdown-item profile-link">
                    <User size={16} />
                    {getTranslation('profile', language)}
                  </a>
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
            <input 
              type="text" 
              className="search-input" 
              placeholder={getTranslation('searchPlaceholder', language)}
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