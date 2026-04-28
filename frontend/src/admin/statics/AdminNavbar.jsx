import React, { useState } from 'react';
import { LogOut, Bell, ChevronDown, Settings, User, LayoutDashboard, Users, MapPin, MessageSquare, Briefcase, Mail } from 'lucide-react';
import '../css/admin-navbar.css';

export default function AdminNavbar({
  currentPage,
  onNavigate,
  adminInfo,
  onLogout
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'travel-tips', label: 'Travel Tips', icon: Briefcase },
    { id: 'contacts', label: 'Contacts', icon: Mail },
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        {/* Left Section - Logo */}
        <div className="admin-navbar-left">
          <div className="admin-navbar-logo">
            <span className="admin-logo-text">TripWise</span>
            <span className="admin-logo-badge">Admin</span>
          </div>
        </div>

        {/* Center Section - Menu Items */}
        <div className="admin-navbar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`admin-navbar-menu-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section - Notifications and Profile */}
        <div className="admin-navbar-right">
          {/* Notifications */}
          <button className="admin-navbar-icon-btn">
            <Bell size={20} />
          </button>

          {/* Profile Menu */}
          <div className="admin-profile-menu-wrapper">
            <button
              className="admin-profile-menu-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="admin-profile-avatar">{adminInfo?.name?.charAt(0) || 'A'}</div>
              <div className="admin-profile-info">
                <span className="admin-profile-name">{adminInfo?.name || 'Admin'}</span>
                <span className="admin-profile-role">{adminInfo?.role || 'Admin'}</span>
              </div>
              <ChevronDown size={18} />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="admin-profile-dropdown">
                <div className="admin-dropdown-header">
                  <div className="admin-dropdown-user">
                    <div className="admin-dropdown-avatar">{adminInfo?.name?.charAt(0) || 'A'}</div>
                    <div>
                      <div className="admin-dropdown-name">{adminInfo?.name}</div>
                      <div className="admin-dropdown-email">{adminInfo?.email}</div>
                    </div>
                  </div>
                </div>

                <div className="admin-dropdown-divider"></div>

                <button className="admin-dropdown-item">
                  <User size={16} />
                  My Profile
                </button>

                <button className="admin-dropdown-item">
                  <Settings size={16} />
                  Settings
                </button>

                <div className="admin-dropdown-divider"></div>

                <button
                  className="admin-dropdown-item admin-dropdown-logout"
                  onClick={onLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
