# TripWise Architecture Documentation

## System Architecture Overview

TripWise is built using a three-tier architecture:
1. **Presentation Layer** - React frontend with React Router
2. **Application Layer** - FastAPI backend with service layer
3. **Data Layer** - MySQL database with SQLAlchemy ORM

---

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx               # Entry point
│   ├── admin/                 # Admin dashboard pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── pages/            # Sub-pages
│   │   ├── statics/          # Reusable admin components
│   │   └── css/              # Admin styles
│   ├── users/                # User-facing pages
│   │   ├── AIPlanner.jsx     # AI trip planning
│   │   ├── destinations.jsx  # Destination listing
│   │   ├── DestinationDetails.jsx
│   │   ├── discover.jsx      # Discovery page
│   │   ├── reviews.jsx       # Reviews page
│   │   ├── travelTips.jsx    # Travel tips
│   │   ├── UserProfile.jsx
│   │   ├── statics/          # Reusable components (NavBar, Footer, etc.)
│   │   └── css/              # Component styles
│   ├── context/              # React Context
│   │   └── LanguageContext.jsx
│   ├── hooks/                # Custom hooks
│   │   └── useTranslation.js
│   ├── utils/                # Utility functions
│   │   └── translations.js
│   └── assets/               # Images, fonts, etc.
```

### Component Hierarchy
```
App
├── NavBar
│   ├── GoogleLogin
│   ├── AuthModal (Login/Register)
│   └── ProfileModal
├── Routes
│   ├── /
│   │   └── discover
│   ├── /destinations
│   │   └── DestinationDetails
│   ├── /reviews
│   ├── /travel-tips
│   ├── /aiplanner
│   ├── /profile
│   └── /admin (Protected)
│       ├── AdminLogin
│       └── AdminDashboard
│           ├── Dashboard
│           ├── Users
│           ├── Destinations
│           ├── Reviews
│           ├── Contacts
│           ├── Settings
│           └── TravelTips
└── Footer
```

### State Management
- **Global State**: LanguageContext for multi-language support
- **Local State**: useState for component-specific state
- **Persistence**: localStorage for auth tokens and user data
- **Context Pattern**: Used for theme, language, authentication

### Data Flow Pattern
```
User Interaction
    ↓
State Update (useState/Context)
    ↓
API Call (fetch)
    ↓
Backend Processing
    ↓
Response received
    ↓
State Update with response data
    ↓
Component Re-render
```

---

## Backend Architecture

### Directory Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # App factory
│   ├── database.py          # Database connection & session
│   ├── api/                 # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── destinations.py  # Destination endpoints
│   │   ├── trip_plans.py    # Trip planning endpoints
│   │   └── contact_and_reviews.py
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── base.py          # Base model with common fields
│   │   ├── user.py
│   │   ├── destination.py
│   │   ├── trip_plan.py
│   │   ├── review.py
│   │   ├── contact.py
│   │   └── travel_tip.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   └── (schemas for each model)
│   ├── services/            # Business logic layer
│   │   ├── user_service.py
│   │   ├── destination_service.py
│   │   ├── trip_plan_service.py
│   │   ├── ai_trip_service.py
│   │   └── __init__.py
│   ├── middleware/          # Custom middleware
│   │   ├── auth.py          # JWT authentication
│   │   ├── cors.py          # CORS handling
│   │   └── __init__.py
│   └── utils/               # Utility functions
│       ├── jwt_handler.py
│       ├── password_handler.py
│       ├── validators.py
│       ├── response_formatter.py
│       └── __init__.py
├── config/
│   ├── __init__.py
│   └── settings.py          # Configuration management
├── db/                      # Database files
├── migrations/              # Alembic migrations
├── main.py                  # Entry point
├── requirements.txt
├── .env.example
└── tripwise.sql             # Database schema
```

### Service Layer Architecture
```
HTTP Request
    ↓
FastAPI Route Handler (/api/auth, /destinations, etc.)
    ↓
Pydantic Schema Validation
    ↓
Service Layer (UserService, DestinationService, etc.)
    │
    ├── Business Logic
    ├── Data Transformation
    ├── Validation
    └── Error Handling
    ↓
SQLAlchemy ORM Models
    ↓
Database Query
    ↓
Result Processing
    ↓
Response Schema Creation
    ↓
HTTP Response
```

### Middleware Stack
```
Request
    ↓
CORS Middleware (setup_cors)
    ↓
Exception Handlers
    ↓
Route-specific Middleware (auth check)
    ↓
Route Handler
    ↓
Response
```

### Error Handling Pattern
```
try:
    # Business logic
    result = service_method()
except ValueError as e:
    # Client errors (validation, not found)
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    # Server errors
    raise HTTPException(status_code=500, detail=str(e))
```

---

## Data Model Architecture

### Entity Relationship Diagram
```
┌──────────────────┐
│      User        │
├──────────────────┤
│ id (PK)          │
│ email (U)        │
│ password_hash    │
│ name             │
│ google_id (U)    │
│ is_admin         │
│ is_active        │
└────────┬─────────┘
         │ 1:M
         ├─────────────────────┬────────────────┐
         │                     │                │
    ┌────▼───────────┐   ┌──────▼────┐   ┌────▼──────────┐
    │   TripPlan     │   │  Review   │   │ ContactMsg    │
    ├────────────────┤   ├───────────┤   ├───────────────┤
    │ id (PK)        │   │ id (PK)   │   │ id (PK)       │
    │ user_id (FK)   │   │ user_id(F)│   │ name          │
    │ title          │   │ dest_id(F)│   │ email         │
    │ description    │   │ rating    │   │ phone         │
    │ start_date     │   │ comment   │   │ subject       │
    │ end_date       │   │ created_at│   │ message       │
    └────────────────┘   └───────────┘   │ is_read       │
                              │           └───────────────┘
                              │ M:1
                         ┌────▼──────────────┐
                         │  Destination     │
                         ├──────────────────┤
                         │ id (PK)          │
                         │ name             │
                         │ description      │
                         │ location         │
                         │ country          │
                         │ category         │
                         │ image_url        │
                         │ latitude         │
                         │ longitude        │
                         └──────────────────┘
```

### Model Relationships
1. **User → TripPlan**: One user has many trip plans
2. **User → Review**: One user can write many reviews
3. **Destination → Review**: One destination has many reviews
4. **TripPlan → Items**: Implicit relationship (items stored as array in plan)

---

## API Request/Response Flow

### Standard Response Format
```json
{
  "success": true/false,
  "data": {},
  "message": "Human readable message",
  "error": "Error details if applicable"
}
```

### Request Validation Flow
```
Raw Request Body
    ↓
Pydantic Schema Validation
    │
    ├── Type checking
    ├── Required field validation
    ├── Format validation
    └── Custom validators
    ↓
If valid: Pass to handler
If invalid: Return 422 Unprocessable Entity with details
```

### Authentication Flow
```
Request with Authorization Header
    ↓
JWT Verification (get_current_user middleware)
    │
    ├── Extract token from header
    ├── Decode JWT
    ├── Verify signature
    └── Check expiration
    ↓
If valid: Attach User to request context
If invalid: Return 401 Unauthorized
```

---

## Database Query Optimization

### Indexing Strategy
```sql
-- Foreign keys (automatic)
INDEX idx_user_id (user_id)
INDEX idx_destination_id (destination_id)

-- Search optimization
INDEX idx_email (email)
INDEX idx_google_id (google_id)
INDEX idx_country (country)
INDEX idx_category (category)

-- Time-based queries
INDEX idx_created_at (created_at)

-- Composite indexes (planned)
INDEX idx_user_created (user_id, created_at)
```

### Query Patterns Used

#### Eager Loading (ORM)
```python
# Load user with all related data
user = db.query(User).options(
    joinedload(User.trip_plans),
    joinedload(User.reviews)
).filter(User.id == user_id).first()
```

#### Pagination
```python
query = db.query(Model)
query = query.offset(skip).limit(limit)
results = query.all()
```

#### Filtering with Conditions
```python
query = db.query(Destination)
if search_query:
    query = query.filter(
        or_(
            Destination.name.ilike(f"%{search_query}%"),
            Destination.description.ilike(f"%{search_query}%"),
            Destination.location.ilike(f"%{search_query}%")
        )
    )
if category:
    query = query.filter(Destination.category == category)
```

---

## Authentication & Security

### JWT Token Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "1",              # user_id
  "exp": 1234567890,       # expiration timestamp
  "iat": 1234567800        # issued at
}

Signature: HMACSHA256(header + payload, SECRET_KEY)
```

### Password Security
- **Hashing**: bcrypt with salt
- **Verification**: bcrypt.verify() timing-safe comparison
- **Requirements**: Min 8 chars, uppercase, lowercase, numbers

### API Security Measures
- CORS middleware restricts cross-origin requests
- JWT prevents unauthorized access
- Input validation prevents injection attacks
- HTTPS recommended for production
- Environment variables for sensitive data

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (JWT-based)
- Database can be separated to RDS
- Frontend deployed to CDN
- Implement load balancing for multiple backend instances

### Performance Optimization
- Database connection pooling
- Query result caching (Redis - future enhancement)
- Pagination for large datasets
- Lazy loading on frontend
- Image optimization/CDN for media

### Future Enhancements
- Real-time notifications (WebSocket)
- Caching layer (Redis)
- Search index (Elasticsearch)
- Message queue (Celery/RabbitMQ)
- Rate limiting middleware

---

## Deployment Architecture

### Local Development
```
Frontend (Vite) - localhost:5173
Backend (Uvicorn) - localhost:8000
Database (MySQL) - localhost:3306
```

### Production Deployment
```
CDN (Static assets)
    ↓
Reverse Proxy (Nginx)
    ↓
Load Balancer
    ↓
Application Servers (Gunicorn + Uvicorn) x N
    ↓
Database (RDS/AWS)
```

---

## Development Workflow

### Local Development Setup
1. Clone repository
2. Create virtual environment
3. Install dependencies
4. Configure .env
5. Initialize database
6. Run migrations
7. Start backend server
8. Start frontend server

### Testing (Future)
- Unit tests for services
- Integration tests for API endpoints
- E2E tests for critical flows
- Mock API responses for frontend tests

### Version Control
- Feature branches for development
- Pull requests for code review
- Semantic versioning for releases
- Squash commits for clean history

---

**Document Version**: 1.0
**Last Updated**: May 2024
