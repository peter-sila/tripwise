# TripWise - AI-Powered Travel Planning Platform

**TripWise** is a comprehensive travel planning platform that leverages AI to generate personalized itineraries, discover destinations, and share travel experiences. The application features a modern React frontend and a robust Python FastAPI backend.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Detailed Workflow](#detailed-workflow)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## 🎯 Project Overview

TripWise provides:
- **AI-Powered Trip Planning**: Generate customized travel itineraries using AI
- **Destination Discovery**: Browse and search destinations with detailed information
- **User Reviews & Ratings**: Share travel experiences and discover community recommendations
- **Admin Dashboard**: Manage destinations, users, and platform content
- **Multi-Language Support**: Support for multiple languages with context-aware translations
- **Google OAuth Integration**: Seamless social authentication

### Key Features
- 🤖 AI trip itinerary generation
- 🗺️ Advanced destination search and filtering
- ⭐ Community reviews and ratings
- 👥 User profile management
- 🔐 Secure JWT-based authentication
- 📱 Responsive design
- 🌐 Multi-language support

---

## 🏗️ Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (React 19)                          │
│  ┌──────────────┬──────────────┬────────────────┬────────────────┐ │
│  │   User UI    │  Admin Panel │  Destination  │   AI Planner   │ │
│  │              │              │   Discovery   │                │ │
│  └──────────────┴──────────────┴────────────────┴────────────────┘ │
└────────────────────────────────┬─────────────────────────────────┬─┘
                                 │                                 │
                    HTTP/WebSocket                                │
                    (Port 5173)                                   │
                                 │                                 │
┌────────────────────────────────▼─────────────────────────────────┐─┐
│                    FastAPI Backend (Python)                       │ │
│  ┌────────────────────────────────────────────────────────────┐  │ │
│  │                      API Layer (/api)                      │  │ │
│  │  ┌──────────────┬──────────────┬─────────────────────────┐ │  │ │
│  │  │   /auth      │  /destinations    │   /trip-plans      │ │  │ │
│  │  │  • Login     │  • Search      │  • Generate AI Plans  │ │  │ │
│  │  │  • Register  │  • Details     │  • CRUD Operations    │ │  │ │
│  │  │  • Google    │  • List        │  • AI Integration     │ │  │ │
│  │  │  • Verify    │                └─────────────────────────┘ │  │ │
│  │  └──────────────┴──────────────┬────────────────────────────┘ │  │ │
│  │                                │                              │  │ │
│  │  ┌────────────────────────────▼────────────────────────────┐ │  │ │
│  │  │  Additional Routes                                     │ │  │ │
│  │  │  ┌──────────────┬──────────────┬──────────────────────┐ │ │  │ │
│  │  │  │  /reviews    │  /contact    │  /travel-tips      │ │ │  │ │
│  │  │  │              │              │                    │ │ │  │ │
│  │  │  └──────────────┴──────────────┴──────────────────────┘ │ │  │ │
│  │  └────────────────────────────────────────────────────────┘ │  │ │
│  │                                                              │  │ │
│  │  ┌────────────────────────────────────────────────────────┐ │  │ │
│  │  │          Services Layer (Business Logic)              │ │  │ │
│  │  │  ┌────────────────┬──────────────┬─────────────────┐  │ │  │ │
│  │  │  │ AITripService  │ DestService  │ UserService   │  │ │  │ │
│  │  │  │ • Generate     │ • Search     │ • Auth        │  │ │  │ │
│  │  │  │ • Parse Output │ • Filter     │ • User Mgmt   │  │ │  │ │
│  │  │  │ • Validate     │ • Fetch      │ • Validation  │  │ │  │ │
│  │  │  └────────────────┴──────────────┴─────────────────┘  │ │  │ │
│  │  └────────────────────────────────────────────────────────┘ │  │ │
│  │                                                              │  │ │
│  │  ┌────────────────────────────────────────────────────────┐ │  │ │
│  │  │       Middleware Layer (CORS, Auth, Logging)          │ │  │ │
│  │  └────────────────────────────────────────────────────────┘ │  │ │
│  └────────────────────────────────────────────────────────────┘  │  │
│                                                                    │  │
│  ┌────────────────────────────────────────────────────────────┐  │  │
│  │               Database Models (SQLAlchemy ORM)             │  │  │
│  │  ┌──────────────┬──────────────┬────────────────────────┐  │  │ │
│  │  │    User      │ Destination  │   TripPlan             │  │  │ │
│  │  │              │              │                        │  │  │ │
│  │  └──────────────┴──────────────┴────────────────────────┘  │  │ │
│  │  ┌──────────────┬──────────────┬────────────────────────┐  │  │ │
│  │  │    Review    │   Contact    │  TravelTip            │  │  │ │
│  │  │              │              │                        │  │  │ │
│  │  └──────────────┴──────────────┴────────────────────────┘  │  │ │
│  └────────────────────────────────────────────────────────────┘  │  │
└────────────────────────────────┬─────────────────────────────────┘─┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │   MySQL Database    │
                    │  (Port 3306)        │
                    │  tripwise_db        │
                    └─────────────────────┘
```

### Component Breakdown

**Frontend (React)**
- Single Page Application (SPA) using React Router
- Context API for state management (Language, Auth)
- Component-based architecture with Bootstrap styling
- Modular CSS structure with dedicated style sheets

**Backend (FastAPI)**
- RESTful API architecture
- Pydantic schemas for request/response validation
- SQLAlchemy ORM for database abstraction
- JWT-based authentication
- CORS middleware for cross-origin requests
- Google OAuth integration

**Database (MySQL)**
- Normalized relational schema
- User authentication data
- Destination information
- Trip plans and itineraries
- Reviews and ratings
- Contact messages

---

## 💻 Technology Stack

### Frontend
```
- React 19.2.5 - UI framework
- React Router DOM 7.14 - Client-side routing
- React Bootstrap 2.10 - Component library
- Bootstrap 5.3.8 - CSS framework
- Lucide React 1.8 - Icon library
- React OAuth/Google 0.12 - Google authentication
```

### Backend
```
- Python 3.8+ - Language
- FastAPI 0.104.1 - Web framework
- Uvicorn 0.24 - ASGI server
- SQLAlchemy 2.0.23 - ORM
- Pydantic 2.5 - Data validation
- PyJWT 2.8.1 - JWT handling
- bcrypt 4.1.1 - Password hashing
- MySQL Connector 8.2 - Database driver
```

### Database
```
- MySQL 8.0 - Relational database
- Alembic 1.13 - Schema migrations
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Set database credentials, JWT secret, OpenAI API key, etc.

# Install dependencies
pip install -r requirements.txt

# Set up database
mysql -u root -p < tripwise.sql

# Run migrations (if any)
# python -m alembic upgrade head

# Start backend server
python main.py
# Server will run on http://localhost:8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 📊 Detailed Workflow

### 1. **Authentication Flow**

#### Registration Flow
```
User Input (Email, Password, Name)
          ↓
Frontend: POST /api/auth/register
          ↓
Backend: UserService.create_user()
  - Validate email format
  - Validate password strength (min 8 chars, uppercase, lowercase, numbers)
  - Check if email already exists
  - Hash password with bcrypt
  - Create User record in database
          ↓
Generate JWT Token (exp: 24 hours)
          ↓
Response: {access_token, token_type: "bearer", user: UserData}
          ↓
Frontend: Store token in localStorage
          ↓
Redirect to dashboard/profile
```

#### Login Flow
```
User Input (Email, Password)
          ↓
Frontend: POST /api/auth/login
          ↓
Backend: UserService.authenticate_user()
  - Find user by email
  - Compare password with hash using bcrypt.verify()
  - Raise error if mismatch
          ↓
Generate JWT Token (exp: 24 hours)
          ↓
Response: {access_token, token_type: "bearer", user: UserData}
          ↓
Frontend: Store token in localStorage
          ↓
Update user context state
          ↓
Redirect based on user role (admin/user)
```

#### Google OAuth Flow
```
User clicks: "Sign in with Google"
          ↓
Frontend: GoogleLogin component handles OAuth callback
  - Receives ID token from Google
  - Sends token to backend
          ↓
Frontend: POST /api/auth/google
          ↓
Backend:
  - Decode Google ID token (JWT)
  - Extract: google_id, email, name
  - Validate token structure and payload
  - Call UserService.get_or_create_google_user()
    * Check if user exists by google_id
    * If not, check by email
    * Create new user if neither exists
    * Link google_id to existing email-based user
          ↓
Generate JWT Token
          ↓
Response: {access_token, token_type: "bearer", user: UserData}
          ↓
Frontend: Store token, update state, redirect
```

#### Token Verification Flow
```
Frontend: Every API request
          ↓
Add Header: Authorization: Bearer {token}
          ↓
Backend: Middleware get_current_user()
  - Extract token from Authorization header
  - Decode JWT using JWT_SECRET_KEY
  - Verify token not expired
  - Extract user_id from token payload
  - Query database to get User object
  - Attach user to request context
          ↓
Route Handler: Receives authenticated user
          ↓
If token invalid/expired: Return 401 Unauthorized
```

---

### 2. **Trip Planning with AI**

#### AI Trip Generation Flow
```
User Input (Preferences)
  - Destination
  - Duration days
  - Budget level (budget/moderate/luxury)
  - Travel style (adventure/relaxation/cultural)
  - Group size
  - Interests (array)
  - Accommodation type
          ↓
Frontend: POST /api/trip-plans/generate-with-ai
          ↓
Backend: AITripService.generate_trip_plan()
  - Validate preferences using AITripService.validate_preferences()
  - Call OpenAI API with structured prompt:
    * Build prompt template with user preferences
    * Request JSON response with specific structure
    * Include budget constraints, travel style, interests
          ↓
OpenAI GPT-4 Response
  - Returns structured JSON with itinerary
  - Format: {title, description, start_date, end_date, items: [...]}
          ↓
Backend: Parse and validate response
  - Extract dates from natural language if needed
  - Validate all required fields present
  - Structure items array (date, time, activity, description)
          ↓
Option A: Auto-save enabled
  - Create TripPlan record in database
  - Associate with current user
  - Return: {success, message, data: tripPlanObject}
          ↓
Option B: Auto-save disabled
  - Return generated data without saving
          ↓
Frontend: Display generated itinerary
  - User can review plan
  - Edit before saving
  - Share or export
```

#### Trip Plan CRUD Flow
```
Create Trip Plan:
  POST /api/trip-plans
  - Validate title, dates
  - Create TripPlan record
  - Associate with authenticated user

Read Trip Plans:
  GET /api/trip-plans
  - Query all user's trip plans
  - Include related items (destinations, activities)
  - Sort by created_at DESC

Update Trip Plan:
  PUT /api/trip-plans/{id}
  - Verify ownership (user_id matches)
  - Update fields (title, description, dates)
  - Update related items

Delete Trip Plan:
  DELETE /api/trip-plans/{id}
  - Verify ownership
  - Delete trip plan
  - Cascade delete related items
```

---

### 3. **Destination Discovery Flow**

#### Search & Filter Flow
```
User Input (Search query, category filter)
          ↓
Frontend: GET /api/destinations/search?query=Paris&category=cultural
          ↓
Backend: DestinationService.search_destinations()
  - Build SQLAlchemy query
  - Apply filters:
    * Full-text search on name, description, location
    * Category filter if provided
    * Pagination (limit, offset)
  - Execute query
  - Return matching destinations
          ↓
Response: {success, data: [destinations], count, query, category}
          ↓
Frontend: 
  - Display results with images, descriptions
  - Highlight search term
  - Show category badge
```

#### Destination Details Flow
```
User clicks: Destination card
          ↓
Frontend: GET /api/destinations/{destination_id}
          ↓
Backend: DestinationService.get_destination()
  - Query database for destination by ID
  - Load all related data
  - Calculate average review rating
  - Count total reviews
          ↓
Parallel Requests:
  GET /api/reviews?destination_id={id}
  - Fetch all reviews for this destination
  - Include reviewer names, dates, ratings
  - Sort by date DESC
          ↓
GET /api/travel-tips?destination_id={id}
  - Fetch travel tips for this destination
  - Group by category
          ↓
Frontend: Display comprehensive view
  - Destination overview, images, details
  - Reviews section with ratings
  - Travel tips widget
  - Add review button (if authenticated)
```

---

### 4. **Review & Feedback Flow**

#### Submit Review Flow
```
User Input (Rating 1-5, Comment)
          ↓
Frontend: POST /api/reviews
  - Check authentication token
  - Validate rating between 1-5
  - Validate comment length
          ↓
Backend: ReviewService.create_review()
  - Verify user authenticated (extract from JWT)
  - Validate destination exists
  - Create Review record with:
    * user_id (from token)
    * destination_id
    * rating
    * comment
    * created_at (current timestamp)
          ↓
Database: Insert review
          ↓
Response: {success, message, data: reviewObject}
          ↓
Frontend: 
  - Show success message
  - Clear form
  - Refresh reviews list
  - Update average rating display
```

#### Fetch Reviews Flow
```
Frontend: GET /api/reviews?destination_id={id}&limit=10
          ↓
Backend:
  - Query reviews for destination
  - Join with User table for reviewer names
  - Sort by created_at DESC
  - Apply pagination
          ↓
Response: {success, data: [reviews], count}
          ↓
Frontend: Render reviews
  - Display reviewer name, rating, comment, date
  - Show average rating star display
  - Highlight top reviews
```

---

### 5. **Contact Message Flow**

#### Submit Contact Message Flow
```
User Input (Name, Email, Phone, Subject, Message)
          ↓
Frontend: POST /api/contact
  - Client-side validation
  - Validate email format
  - Minimum message length
          ↓
Backend:
  - Validate all required fields
  - Sanitize inputs (prevent SQL injection, XSS)
  - Create ContactMessage record with:
    * name, email, phone, subject, message
    * created_at timestamp
    * is_read: false
    * admin_note: null
          ↓
Database: Insert contact message
          ↓
Response: {success, message, data: contactObject}
          ↓
Frontend: 
  - Show success message
  - Clear form
  - Optionally send email notification to admin
```

---

### 6. **User Profile Management**

#### View Profile Flow
```
Authenticated user navigates to profile
          ↓
Frontend: Fetch user data from token/localStorage
          ↓
Frontend: GET /api/auth/me
          ↓
Backend: get_current_user middleware
  - Decode JWT token
  - Verify token valid
  - Query User from database
  - Return UserResponse schema
          ↓
Frontend: Display profile information
  - Name, email, account creation date
  - Trip plans count
  - Reviews submitted count
```

#### Update Profile Flow
```
User edits: Name, Password
          ↓
Frontend: POST /api/auth/profile (optional endpoint)
  - Validate new password if provided
  - Send current password for verification
          ↓
Backend:
  - Verify current password matches hash
  - Hash new password if provided
  - Update User record
  - Return updated user data
          ↓
Frontend: Update localStorage, show success
```

---

### 7. **Admin Dashboard Flow**

#### Admin Login Flow
```
Admin enters: Email, Password
          ↓
Frontend: POST /api/auth/login
          ↓
Backend: Verify credentials, check is_admin field
          ↓
Response includes: user.is_admin = true
          ↓
Frontend: Check is_admin flag
  - If true: Redirect to /admin/dashboard
  - If false: Show error "Admin access only"
          ↓
Admin Dashboard:
  - View statistics (users, reviews, messages)
  - Manage destinations (CRUD)
  - Manage users (view, deactivate)
  - View contact messages
  - Manage travel tips
```

---

## 🔌 API Reference

### Authentication Endpoints

#### POST /api/auth/register
Create new user account
```json
Request:
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123"
}

Response (201):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "is_admin": false
  }
}
```

#### POST /api/auth/login
Authenticate user
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": { ... }
}
```

#### POST /api/auth/google
Google OAuth authentication
```json
Request:
{
  "id_token": "Google JWT token from frontend"
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": { ... }
}
```

#### GET /api/auth/me
Get current user profile (requires auth)
```
Headers: Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "is_admin": false,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

#### GET /api/auth/verify
Verify token validity (requires auth)
```
Response (200):
{
  "valid": true,
  "message": "Token is valid",
  "user": { ... }
}
```

---

### Destinations Endpoints

#### GET /api/destinations
List all destinations with pagination
```
Query Params:
- limit: int (default: 100, max: 1000)
- offset: int (default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Paris",
      "description": "The City of Light...",
      "location": "France",
      "country": "France",
      "category": "cultural",
      "image_url": "...",
      "latitude": 48.8566,
      "longitude": 2.3522
    }
  ],
  "limit": 100,
  "offset": 0
}
```

#### GET /api/destinations/search
Search destinations by query and category
```
Query Params:
- query: string (searches name, description, location)
- category: string (optional filter)
- limit: int (default: 10, max: 100)
- offset: int (default: 0)

Response:
{
  "success": true,
  "data": [ ... ],
  "query": "Paris",
  "category": "cultural",
  "count": 5
}
```

#### GET /api/destinations/{destination_id}
Get specific destination details
```
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Paris",
    ... full destination object
  }
}
```

---

### Trip Plans Endpoints

#### POST /api/trip-plans/generate-with-ai
Generate trip with AI
```json
Request (requires auth):
{
  "destination": "Paris",
  "duration_days": 5,
  "start_date": "2024-06-01",
  "budget": "moderate",
  "travel_style": "cultural",
  "group_size": 2,
  "interests": ["museums", "food", "history"],
  "accommodation": "hotel",
  "auto_save": true
}

Response (201):
{
  "success": true,
  "message": "Trip plan generated and saved successfully",
  "data": {
    "id": 1,
    "title": "Cultural Paris Adventure",
    "description": "Explore Paris's rich cultural heritage...",
    "start_date": "2024-06-01",
    "end_date": "2024-06-05",
    "items": [
      {
        "date": "2024-06-01",
        "time": "10:00",
        "title": "Arrive at CDG Airport",
        "description": "Arrive and transfer to hotel"
      }
    ]
  }
}
```

#### GET /api/trip-plans
Get user's trip plans (requires auth)
```
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Paris Trip",
      "start_date": "2024-06-01",
      "end_date": "2024-06-05",
      "created_at": "2024-05-01T10:30:00"
    }
  ]
}
```

#### POST /api/trip-plans
Create trip plan (requires auth)
```json
Request:
{
  "title": "My Paris Trip",
  "description": "A week in Paris",
  "start_date": "2024-06-01",
  "end_date": "2024-06-07",
  "items": [ ... ]
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

#### PUT /api/trip-plans/{id}
Update trip plan (requires auth, ownership)
```
Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### DELETE /api/trip-plans/{id}
Delete trip plan (requires auth, ownership)
```
Response (200):
{
  "success": true,
  "message": "Trip plan deleted successfully"
}
```

---

### Reviews Endpoints

#### POST /api/reviews
Submit review (requires auth)
```json
Request:
{
  "destination_id": 1,
  "rating": 5,
  "comment": "Amazing place! Highly recommended."
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "destination_id": 1,
    "rating": 5,
    "comment": "Amazing place!",
    "created_at": "2024-05-01T10:30:00"
  }
}
```

#### GET /api/reviews
Get reviews (optional: filter by destination)
```
Query Params:
- destination_id: int (filter by destination)
- limit: int
- offset: int

Response:
{
  "success": true,
  "data": [ ... ]
}
```

---

### Contact Endpoints

#### POST /api/contact
Submit contact message
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Feature Request",
  "message": "I would like to request..."
}

Response (201):
{
  "success": true,
  "message": "Message sent successfully",
  "data": { ... }
}
```

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),  -- NULL for OAuth users
  name VARCHAR(255) NOT NULL,
  google_id VARCHAR(255) UNIQUE,  -- For OAuth
  is_active BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_google_id (google_id)
);
```

### Destinations Table
```sql
CREATE TABLE destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  country VARCHAR(255),
  category VARCHAR(100),  -- cultural, beach, adventure, etc.
  image_url VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  best_time_to_visit VARCHAR(100),
  budget_level VARCHAR(50),  -- budget, moderate, luxury
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_country (country),
  INDEX idx_category (category)
);
```

### Trip Plans Table
```sql
CREATE TABLE trip_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  destination_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  INDEX idx_destination_id (destination_id),
  INDEX idx_user_id (user_id)
);
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  admin_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_email (email)
);
```

---

## 🚢 Deployment

### Backend Deployment

#### Environment Configuration
```bash
# Set environment variables for production
DEBUG=False
SERVER_HOST=0.0.0.0
SERVER_PORT=8000

# Database (Production)
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_USER=prod_user
DB_PASSWORD=strong_password
DB_NAME=tripwise_prod

# JWT Security (Change in production!)
JWT_SECRET_KEY=your_super_secret_key_change_this
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# AI/ML
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

#### Production Deployment (Gunicorn + Nginx)
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app

# Nginx configuration (sample)
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Frontend Deployment

#### Build for Production
```bash
npm run build  # Creates dist/ folder

# Deploy to static hosting (Vercel, Netlify, S3+CloudFront, etc.)
```

#### Environment Configuration
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 📝 Development Guidelines

### Code Organization
- **Frontend**: Component-based with co-located CSS
- **Backend**: Services pattern with separation of concerns
- **Database**: ORM-based with migration support

### Best Practices
- Always validate user input on both frontend and backend
- Use HTTP status codes correctly (200, 201, 400, 401, 404, 500)
- Implement proper error handling and logging
- Use environment variables for configuration
- Keep API responses consistent with schema validation
- Document API endpoints with request/response examples

---

## 🐛 Troubleshooting

### Backend Issues
- **Module not found**: Ensure virtual environment activated and requirements installed
- **Database connection**: Check MySQL is running and credentials in .env
- **CORS errors**: Verify FRONTEND_URL in settings matches frontend URL
- **JWT errors**: Check JWT_SECRET_KEY configured and token not expired

### Frontend Issues
- **API connection**: Verify backend running on localhost:8000
- **Auth issues**: Clear localStorage, check token validity
- **OAuth failure**: Verify Google credentials in frontend component

---

## 📞 Support & Contribution

For issues, feature requests, or contributions, please refer to the GitHub repository.

---

**Last Updated**: May 2024
**Version**: 1.0.0
