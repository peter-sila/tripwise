import React from 'react';
import {
  LayoutDashboard, Users, MapPin, MessageSquare, Briefcase, Mail, Settings
} from 'lucide-react';
import '../css/admin-sidebar.css';

export default function AdminSidebar({ currentPage, onNavigate, isOpen }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: null
    },
    {
      id: 'destinations',
      label: 'Destinations',
      icon: MapPin,
      badge: null
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: MessageSquare,
      badge: null
    },
    {
      id: 'travel-tips',
      label: 'Travel Tips',
      icon: Briefcase,
      badge: null
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Mail,
      badge: 'new'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="admin-sidebar-overlay" onClick={() => onNavigate(currentPage)} />}

      <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-content">
          <nav className="admin-sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`admin-sidebar-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                >
                  <Icon size={20} />
                  <span className="admin-sidebar-label">{item.label}</span>
                  {item.badge && (
                    <span className={`admin-sidebar-badge ${item.badge}`}>
                      {item.badge === 'new' ? 'New' : item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-version">
            <p>TripWise Admin v1.0</p>
            <small>© 2024 All rights reserved</small>
          </div>
        </div>
      </aside>
    </>
  );
}
