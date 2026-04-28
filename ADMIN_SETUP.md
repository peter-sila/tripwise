# TripWise Admin Panel - Setup & Documentation

## Overview
The TripWise Admin Panel is a comprehensive management system for administrators to control all aspects of the platform. It features a modern dashboard with a top navigation bar and collapsible sidebar for managing users, destinations, reviews, travel tips, contacts, and system settings.

## Features
- **Admin Authentication**: Secure login system with role-based access
- **Dashboard**: Overview of platform statistics and recent activity
- **User Management**: View, edit, and manage user accounts
- **Destinations**: Manage travel destinations and locations
- **Reviews Management**: Monitor and manage user reviews
- **Travel Tips**: Manage travel advice content
- **Contacts**: View and respond to contact form submissions
- **Settings**: Configure platform settings and preferences
- **Top Navigation Bar**: Clean, modern top navbar with profile menu
- **Responsive Sidebar**: Collapsible sidebar (hidden on mobile by default)
- **Responsive Design**: Full mobile support with touch-friendly interface

## Folder Structure
```
frontend/src/admin/
├── AdminLogin.jsx           # Login page component
├── AdminDashboard.jsx       # Main dashboard with layout
├── css/
│   ├── admin-login.css      # Login page styles
│   ├── admin-navbar.css     # Top navbar styles
│   ├── admin-sidebar.css    # Sidebar styles
│   └── admin-dashboard.css  # Dashboard and reusable component styles
├── statics/
│   ├── AdminNavbar.jsx      # Top navigation bar component
│   └── AdminSidebar.jsx     # Sidebar navigation component
└── pages/
    ├── Dashboard.jsx        # Dashboard overview
    ├── Users.jsx            # User management
    ├── Destinations.jsx     # Destination management
    ├── Reviews.jsx          # Review management
    ├── TravelTips.jsx       # Travel tips management
    ├── Contacts.jsx         # Contact form management
    └── Settings.jsx         # System settings
```

## Installation & Setup

### 1. Database Setup
Run the migration to add admin functionality:

```bash
# Connect to your MySQL database and run:
mysql -u root -p < backend/db/migration_add_admin.sql
```

This creates:
- `admins` table for admin users
- Default super admin user with email: `admin@tripwise.com`

### 2. Default Admin Credentials
- **Email**: admin@tripwise.com
- **Password**: admin123

**Important**: Change these credentials immediately in production!

### 3. Backend API
The admin API endpoint is located at: `backend/api/admin.php`

Supported operations:
- `POST /admin.php` - Admin login with action='login'
- `GET /admin.php` - Verify admin authentication

### 4. Access the Admin Panel
Navigate to: `http://localhost:5173/admin/login`

Or use this direct URL: `http://localhost:5173/admin/dashboard` (will redirect to login if not authenticated)

## Authentication Flow

1. **Login**: User enters credentials at `/admin/login`
2. **API Call**: Credentials sent to `POST /backend/api/admin.php`
3. **Token Generation**: Server returns JWT token (currently simplified)
4. **Storage**: Token stored in `localStorage` as `adminToken`
5. **Dashboard Access**: Token used for authenticated requests
6. **Session**: Token persists across page refreshes

## Component Architecture

### AdminLogin.jsx
- Dual-column layout (branding + form on desktop, stacked on mobile)
- Email and password input fields
- Show/hide password toggle
- Demo credentials display
- Error handling with visual feedback
- Loading state with spinner animation

### AdminNavbar.jsx (Top Navigation)
- Logo and branding on left
- Search bar in center (optional)
- Notifications bell icon
- Profile menu with avatar
- Dropdown menu with profile options
- Responsive design (collapses on mobile)

### AdminSidebar.jsx (Collapsible Navigation)
- Menu items with icons:
  - Dashboard
  - Users
  - Destinations
  - Reviews
  - Travel Tips
  - Contacts
  - Settings
- Active item highlighting with left border
- Badges for new items
- Footer with version info
- Touch-overlay for mobile
- Auto-close on mobile when item selected

### Dashboard Pages
Each page component follows a consistent pattern:
- Page header with title and description
- Content cards with data tables
- Action buttons (Edit, Delete, Add)
- Status badges
- Sample data for demonstration

## Styling System

### CSS Variables (Root)
```css
--primary-color: #0f68cb
--primary-dark: #0550a1
--secondary-color: #4ade80
--danger-color: #ef4444
--warning-color: #f59e0b
--text-primary: #1f2937
--text-secondary: #6b7280
--border-color: #e5e7eb
--bg-light: #f9fafb
--bg-white: #ffffff
```

### Reusable Classes
- `.admin-card` - Card container
- `.admin-btn` - Button (primary, secondary, danger)
- `.admin-table` - Data table
- `.admin-form` - Form layout
- `.admin-badge` - Status badge (success, danger, warning, primary)
- `.admin-grid` - Grid layouts (1-4 columns)
- `.admin-alert` - Alert messages

## Responsive Design

### Breakpoints
- **Desktop**: > 768px (sidebar always visible, full layout)
- **Tablet**: 768px (sidebar collapsible, reduced padding)
- **Mobile**: < 480px (sidebar hidden, stacked layout, single column)

### Mobile Optimizations
- Hamburger menu for sidebar toggle
- Touch-friendly button sizes (minimum 48px)
- Simplified navigation
- Single-column layout for tables (convert to cards)
- Reduced font sizes
- Adjusted spacing

## API Endpoints Reference

### Admin Login
```
POST /backend/api/admin.php
Content-Type: application/json

{
  "action": "login",
  "email": "admin@tripwise.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "...",
  "admin": {
    "id": 1,
    "email": "admin@tripwise.com",
    "name": "Super Admin",
    "role": "super_admin",
    "permissions": {...}
  }
}
```

### Verify Authentication
```
GET /backend/api/admin.php
Authorization: Bearer <token>

Response:
{
  "authenticated": true
}
```

## Role-Based Access Control (RBAC)

### Roles Available
- `super_admin`: Full access to all features
- `admin`: Limited access (customizable)
- `moderator`: Content moderation only

### Permission System
Permissions stored as JSON in admin record:
```json
{
  "all": true,
  "manage_users": true,
  "manage_content": true,
  "manage_settings": false
}
```

## Security Best Practices

1. **Password Security**
   - Use bcrypt hashing (implemented in admin.php)
   - Never store plain-text passwords
   - Enforce strong password policies

2. **Token Management**
   - Use JWT tokens in production (currently simplified)
   - Set appropriate token expiration
   - Refresh tokens on sensitive operations

3. **CORS Security**
   - Configure CORS headers for trusted origins only
   - Currently allows: `http://localhost:5173`

4. **Input Validation**
   - Server-side validation for all inputs
   - SQL injection prevention with prepared statements
   - XSS protection

5. **Data Protection**
   - Use HTTPS in production
   - Implement CSRF protection
   - Secure sensitive data

## Customization Guide

### Adding New Admin Menu Items
Edit `AdminSidebar.jsx`:
```jsx
const menuItems = [
  // ...existing items
  {
    id: 'new-page',
    label: 'New Page',
    icon: SomeIcon,
    badge: null
  }
];
```

Create new page in `pages/NewPage.jsx`:
```jsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page Title</h1>
      {/* Page content */}
    </div>
  );
}
```

Update `AdminDashboard.jsx` to import and render the new page.

### Changing Color Scheme
Modify CSS variables in component CSS files:
```css
:root {
  --primary-color: #new-color;
  --primary-dark: #darker-shade;
  /* ... */
}
```

### Adding More Data Tables
Use the `.admin-table` class and follow the pattern in existing pages.

## Troubleshooting

### Login Not Working
- Check if admin user exists in database
- Verify database connection in `config.php`
- Check CORS headers are properly configured
- Ensure password is correctly hashed

### Token Issues
- Check localStorage for `adminToken`
- Verify token is being sent in Authorization header
- Check token expiration time (if implemented)

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check if CSS files are imported correctly
- Verify no conflicting global styles

### Mobile Responsive Issues
- Test with browser DevTools
- Check media queries in CSS files
- Verify viewport meta tag in HTML

## Future Enhancements

- [ ] Add JWT token implementation
- [ ] Implement real database queries
- [ ] Add file upload functionality
- [ ] Add charts and analytics
- [ ] Implement email notifications
- [ ] Add user activity logging
- [ ] Implement API rate limiting
- [ ] Add export to CSV/PDF features
- [ ] Add bulk actions for tables
- [ ] Implement real-time notifications
- [ ] Add user role management UI
- [ ] Add audit trail

## Support & Documentation

For more information, see:
- [PROJECT_DOCUMENTATION.md](../../PROJECT_DOCUMENTATION.md)
- [API Documentation](../../SETUP_AND_API_REFERENCE.md)
- [Frontend Guide](../../FRONTEND_GUIDE.md)

## License
TripWise Admin Panel - All rights reserved
