# Setup & Configuration Guide

## Complete Installation Guide

### Prerequisites
- Windows 10+ / macOS / Linux
- Python 3.8 or higher
- Node.js 18.0 or higher  
- MySQL 8.0 or higher
- Git

### Step-by-Step Installation

## 🔧 Backend Setup

### 1. Database Setup

#### Windows
```bash
# Install MySQL (if not already installed)
# Download from: https://dev.mysql.com/downloads/mysql/

# Start MySQL service
net start MySQL80

# Connect to MySQL
mysql -u root -p

# Create database (in MySQL shell)
CREATE DATABASE tripwise_db;
CREATE USER 'tripwise_user'@'localhost' IDENTIFIED BY 'tripwise_pass';
GRANT ALL PRIVILEGES ON tripwise_db.* TO 'tripwise_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u root -p tripwise_db < backend/tripwise.sql
```

#### macOS
```bash
# Install MySQL via Homebrew
brew install mysql
brew services start mysql

# Create database
mysql -u root

# Inside MySQL shell
CREATE DATABASE tripwise_db;
CREATE USER 'tripwise_user'@'localhost' IDENTIFIED BY 'tripwise_pass';
GRANT ALL PRIVILEGES ON tripwise_db.* TO 'tripwise_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u root tripwise_db < backend/tripwise.sql
```

#### Linux (Ubuntu/Debian)
```bash
# Install MySQL
sudo apt-get update
sudo apt-get install mysql-server

# Start service
sudo systemctl start mysql

# Create database
sudo mysql -u root

# Inside MySQL shell (same commands as macOS)
CREATE DATABASE tripwise_db;
CREATE USER 'tripwise_user'@'localhost' IDENTIFIED BY 'tripwise_pass';
GRANT ALL PRIVILEGES ON tripwise_db.* TO 'tripwise_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u root tripwise_db < backend/tripwise.sql
```

### 2. Python Environment Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Verify activation (should show (venv) in prompt)
```

### 3. Dependencies Installation

```bash
# Upgrade pip
pip install --upgrade pip

# Install required packages
pip install -r requirements.txt

# Verify installation
pip list
```

### 4. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# (Use your preferred text editor)
```

#### .env Configuration Reference

```env
# ==================
# DATABASE
# ==================
DB_HOST=localhost
DB_PORT=3306
DB_USER=tripwise_user
DB_PASSWORD=tripwise_pass
DB_NAME=tripwise_db

# ==================
# JWT & SECURITY
# ==================
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# ==================
# SERVER
# ==================
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=True

# ==================
# FRONTEND
# ==================
FRONTEND_URL=http://localhost:5173

# ==================
# AI/ML (Optional)
# ==================
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# ==================
# GOOGLE OAUTH (Optional)
# ==================
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ==================
# EMAIL (Optional)
# ==================
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 5. Database Verification

```bash
# Verify database connection
python -c "
from app.database import engine
from app.models import Base

# Test connection
with engine.connect() as conn:
    print('✅ Database connection successful!')
    
# Check tables
Base.metadata.reflect(bind=engine)
print(f'✅ Tables found: {list(Base.metadata.tables.keys())}')
"
```

### 6. Start Backend Server

```bash
# Make sure you're in backend directory with venv activated
python main.py

# Expected output:
# INFO:     Started server process [12345]
# INFO:     Waiting for application startup.
# INFO:     Application startup complete.
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Verify Backend is Running
- Navigate to: http://localhost:8000/docs
- Should show interactive API documentation
- Test endpoints via Swagger UI

---

## 💻 Frontend Setup

### 1. Dependencies Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify installation
npm list react react-router-dom react-bootstrap
```

### 2. Environment Configuration

```bash
# Create .env file (usually auto-created by Vite)
# File: frontend/.env

VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Start Development Server

```bash
# Make sure you're in frontend directory
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

#### Verify Frontend is Running
- Navigate to: http://localhost:5173
- Should see TripWise homepage
- Try navigation links

---

## 🔌 Testing the Integration

### 1. Test Authentication Flow

```bash
# Backend running on localhost:8000
# Frontend running on localhost:5173

# In browser console (or use curl):
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "TestPass123"
  }'

# Expected response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIs...",
#   "token_type": "bearer",
#   "user": { "id": 1, "email": "test@example.com", ... }
# }
```

### 2. Test Frontend-Backend Communication

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter credentials
4. Submit form
5. Should see success message and redirect to dashboard
6. Check browser console for any errors

### 3. Test Destination API

```bash
curl http://localhost:8000/api/destinations

# Should return list of destinations
```

---

## 📋 Project-Specific Setup

### Google OAuth Setup

#### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - http://localhost:5173
   - http://localhost:5173/callback
   - Your production domain (when ready)
6. Copy Client ID and Client Secret

#### 2. Configure Backend

```env
# In backend/.env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### 3. Configure Frontend

```javascript
// In frontend/src/users/statics/navbar.jsx
// Or wherever GoogleLogin component is used

<GoogleLogin
  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
/>
```

### OpenAI API Setup (for AI Trip Planning)

#### 1. Get OpenAI API Key

1. Go to [OpenAI API Platform](https://platform.openai.com/)
2. Sign up or log in
3. Create API key
4. Copy key

#### 2. Configure Backend

```env
# In backend/.env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
```

#### 3. Test AI Functionality

```bash
# After starting backend, go to:
http://localhost:8000/docs

# Find: POST /api/trip-plans/generate-with-ai
# Click "Try it out"
# Fill in the request body with:
{
  "destination": "Paris",
  "duration_days": 5,
  "budget": "moderate",
  "travel_style": "cultural",
  "group_size": 2,
  "interests": ["museums", "food"],
  "accommodation": "hotel",
  "auto_save": true
}

# Execute and check response
```

---

## 🐛 Troubleshooting

### Backend Issues

#### "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Solution: Activate virtual environment and install requirements
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

#### "Can't connect to MySQL server"
```bash
# Check if MySQL is running
# Windows: Services app → MySQL80 (should be Running)
# macOS: brew services list
# Linux: sudo systemctl status mysql

# Check credentials in .env
# Default: user=tripwise_user, password=tripwise_pass

# Test connection:
mysql -u tripwise_user -p -h localhost tripwise_db
```

#### "Port 8000 already in use"
```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000

# Kill process:
taskkill /PID <process_id> /F

# Or use different port:
python main.py --port 8001
```

#### "SQLAlchemy table not found"
```bash
# Reimport database schema
mysql -u tripwise_user -p tripwise_db < backend/tripwise.sql

# Or check if tables exist:
mysql -u tripwise_user -p -e "SHOW TABLES;" tripwise_db
```

### Frontend Issues

#### "Cannot find module 'react'"
```bash
# Solution: Install dependencies
npm install

# If still failing, try:
npm install --legacy-peer-deps
```

#### "CORS error - blocked by browser"
```bash
# Check backend CORS configuration
# In backend/app/middleware/cors.py
# Verify FRONTEND_URL=http://localhost:5173

# Also ensure API_BASE in frontend is correct:
# const API_BASE = 'http://localhost:8000/api';
```

#### "Cannot GET /api/xxx"
```bash
# Backend server not running
# Start backend: cd backend && python main.py

# Check if URL is correct
# Should be: http://localhost:8000/api/...
# Not: http://localhost:3000/api/...
```

#### "Token expired/invalid"
```bash
# Clear localStorage
# In browser console:
localStorage.clear()

# Refresh page and log in again
```

### Database Issues

#### "Access denied for user 'tripwise_user'"
```bash
# Check password in .env matches database user
# If forgot password, reset it:
mysql -u root
ALTER USER 'tripwise_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;

# Update .env with new password
```

#### "Unknown database 'tripwise_db'"
```bash
# Create database:
mysql -u root -p
CREATE DATABASE tripwise_db;

# Import schema:
mysql -u root -p tripwise_db < backend/tripwise.sql
```

---

## 📚 Additional Configuration

### Development vs Production

#### Development (.env)
```env
DEBUG=True
JWT_EXPIRATION_HOURS=24
FRONTEND_URL=http://localhost:5173
```

#### Production (.env.production)
```env
DEBUG=False
JWT_EXPIRATION_HOURS=12
JWT_SECRET_KEY=<use_strong_secret>
FRONTEND_URL=https://yourdomain.com
# ... other secure configurations
```

### Database Backup

```bash
# Backup database
mysqldump -u tripwise_user -p tripwise_db > backup.sql

# Restore database
mysql -u tripwise_user -p tripwise_db < backup.sql
```

### Logging

```python
# Configure logging in backend (future)
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

---

## ✅ Verification Checklist

- [ ] MySQL running and database created
- [ ] Backend virtual environment activated
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Backend server running (localhost:8000)
- [ ] Backend API docs accessible (localhost:8000/docs)
- [ ] Frontend dependencies installed
- [ ] Frontend running (localhost:5173)
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can log in
- [ ] Can view destinations
- [ ] Can search destinations
- [ ] Can view destination details
- [ ] Can submit reviews (if logged in)
- [ ] Can submit contact message
- [ ] Google OAuth working (if configured)
- [ ] AI trip planning working (if OpenAI key configured)

---

## 🎯 Next Steps

1. **Customize**: Update database with real destinations
2. **Deploy**: Set up production environment
3. **Scale**: Implement caching, load balancing
4. **Monitor**: Add logging, error tracking, analytics
5. **Enhance**: Add tests, CI/CD pipeline, documentation

---

**Setup Version**: 1.0
**Last Updated**: May 2024
