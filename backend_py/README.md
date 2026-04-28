# TripWise Python Backend

A modern Python backend for the TripWise travel planning application built with FastAPI, SQLAlchemy, and MySQL.

## Features

- 🚀 **FastAPI Framework** - Modern, fast, and easy to use Python web framework
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🗄️ **SQLAlchemy ORM** - Powerful database ORM with MySQL support
- 📝 **Pydantic Schemas** - Data validation and serialization
- 🔄 **CORS Support** - Cross-origin resource sharing configuration
- 🎯 **RESTful API** - Clean and consistent API design
- 📚 **Auto Documentation** - Interactive API documentation with Swagger UI

## Project Structure

```
backend_py/
├── app/
│   ├── api/                 # API route handlers
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── destinations.py # Destination endpoints
│   │   ├── trip_plans.py   # Trip plan endpoints
│   │   └── contact_and_reviews.py
│   ├── middleware/          # Custom middleware
│   │   ├── auth.py         # Authentication middleware
│   │   └── cors.py         # CORS configuration
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── destination.py
│   │   ├── trip_plan.py
│   │   ├── review.py
│   │   ├── travel_tip.py
│   │   └── contact.py
│   ├── schemas/             # Pydantic request/response schemas
│   ├── services/            # Business logic
│   │   ├── user_service.py
│   │   ├── trip_plan_service.py
│   │   └── destination_service.py
│   ├── utils/               # Utility functions
│   │   ├── jwt_handler.py
│   │   ├── password_handler.py
│   │   ├── validators.py
│   │   └── response_formatter.py
│   ├── database.py         # Database connection setup
│   └── main.py             # FastAPI application factory
├── config/
│   ├── settings.py         # Configuration settings
│   └── __init__.py
├── tests/                   # Test files
├── migrations/              # Database migrations (Alembic)
├── requirements.txt         # Python dependencies
├── .env.example            # Example environment variables
└── main.py                 # Entry point

```

## Installation

### Prerequisites

- Python 3.9 or higher
- MySQL 5.7 or higher
- pip (Python package manager)

### Setup Steps

1. **Clone and navigate to backend_py directory**
```bash
cd backend_py
```

2. **Create virtual environment**
```bash
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your database and settings
```

5. **Update database configuration in .env**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tripwise
```

## Running the Application

### Development Mode

```bash
python main.py
```

The application will start at `http://localhost:8000`

### Production Mode

```bash
# Update .env
DEBUG=False

# Run with production settings
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify token

### Destinations
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/search` - Search destinations
- `GET /api/destinations/{id}` - Get destination details

### Trip Plans
- `POST /api/trip-plans` - Create trip plan
- `GET /api/trip-plans` - List user's trip plans
- `GET /api/trip-plans/{id}` - Get trip plan details
- `PUT /api/trip-plans/{id}` - Update trip plan
- `DELETE /api/trip-plans/{id}` - Delete trip plan

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/destination/{id}` - Get destination reviews

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all messages (admin)

## Database Setup

The application automatically creates all necessary tables on first run using SQLAlchemy models. No manual SQL initialization is required.

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=tripwise

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=True

# CORS
FRONTEND_URL=http://localhost:5173

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

## Development

### Running Tests

```bash
pytest tests/
```

### Code Style

```bash
# Format code
black app/ config/

# Lint code
flake8 app/ config/
```

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": null,
  "status_code": 400
}
```

## CORS Configuration

CORS is enabled for:
- `http://localhost:5173` (default frontend)
- `http://localhost:3000` (alternative frontend)
- Configured frontend URL in `.env`

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue in the repository.

---

**Note**: The Python backend is separate from the existing PHP backend. Both can run simultaneously on different ports.
