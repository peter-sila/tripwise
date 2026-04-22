import { useState, useEffect } from 'react';
import { Menu, X, Search, User, Globe, LogIn, LogOut } from 'lucide-react';
import '../css/navbar.css';

const API_BASE = 'http://localhost/tripwise/backend/api';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth.php`, {
        headers: {
          'Authorization': `Bearer ${token}`
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
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setShowAuth(false);
        setAuthData({ email: '', password: '', name: '' });
      } else if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

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
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name}</span>
              <button className="nav-icon-btn" onClick={handleLogout} aria-label="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button className="nav-icon-btn" onClick={() => setShowAuth(!showAuth)} aria-label="Login">
              <LogIn size={20} />
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
            <h3>{authMode === 'login' ? 'Login' : 'Register'}</h3>
            <form onSubmit={handleAuth}>
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Name"
                  value={authData.name}
                  onChange={(e) => setAuthData({...authData, name: e.target.value})}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                required
              />
              <button type="submit">{authMode === 'login' ? 'Login' : 'Register'}</button>
            </form>
            <button 
              className="auth-switch" 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
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