import React, { useState, useEffect } from 'react';
import {
  Users, MapPin, MessageSquare, BarChart3, TrendingUp, ArrowUp, ArrowDown
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDestinations: 0,
    totalReviews: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all stats in parallel
      const [destinationsRes, reviewsRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE}/destinations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/contact`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Process responses
      const destinations = await destinationsRes.json();
      const reviews = await reviewsRes.json();
      const contacts = await contactsRes.json();

      setStats({
        totalUsers: 125,
        totalDestinations: destinations.data ? destinations.data.length : 42,
        totalReviews: reviews.data ? reviews.data.length : 238,
        totalContacts: contacts.data ? contacts.data.length : 18
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <p className="admin-stat-label">{title}</p>
          <p className="admin-stat-value">{value}</p>
          <p className={`admin-stat-change ${trend === 'up' ? 'positive' : 'negative'}`}>
            {trend === 'up' ? <ArrowUp size={14} style={{ display: 'inline', marginRight: '4px' }} /> : <ArrowDown size={14} style={{ display: 'inline', marginRight: '4px' }} />}
            {change}% from last month
          </p>
        </div>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0f68cb, #0550a1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Welcome back! Here's your platform overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-grid admin-grid-4" style={{ marginBottom: '32px' }}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={12}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Destinations"
          value={stats.totalDestinations}
          change={8}
          icon={MapPin}
          trend="up"
        />
        <StatCard
          title="Reviews"
          value={stats.totalReviews}
          change={15}
          icon={MessageSquare}
          trend="up"
        />
        <StatCard
          title="Contact Forms"
          value={stats.totalContacts}
          change={5}
          icon={BarChart3}
          trend="down"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="admin-grid admin-grid-2">
        {/* Recent Users */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <p className="admin-card-title">Recent Users</p>
              <p className="admin-card-subtitle">Latest signups</p>
            </div>
            <button className="admin-btn admin-btn-secondary admin-btn-sm">View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0f68cb, #0550a1)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600'
                  }}>U{i}</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>User {i}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>user{i}@example.com</p>
                  </div>
                </div>
                <span className="admin-badge admin-badge-success">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <p className="admin-card-title">Recent Contacts</p>
              <p className="admin-card-subtitle">Latest messages</p>
            </div>
            <button className="admin-btn admin-btn-secondary admin-btn-sm">View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>Contact {i}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>Contact message subject here...</p>
                </div>
                <span className="admin-badge admin-badge-primary">New</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
