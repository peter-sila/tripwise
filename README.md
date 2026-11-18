# TripWise - Travel Planning Application

A full-stack travel planning web application with destination browsing, trip planning, and AI-powered recommendations.

## Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- SQLite (default; no external setup required)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
# Backend runs on http://localhost:8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## Features
- Browse travel destinations
- Discover new places
- AI-powered trip planning
- Travel tips and reviews
- User profiles
- Responsive design

## API Endpoints
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/search` - Search destinations
- `GET /api/destinations/{id}` - Get destination details
- `GET /api/health` - Health check

## Tech Stack
- **Frontend**: React 18, Vite, React Router, Lucide Icons
- **Backend**: FastAPI, SQLAlchemy, Python
- **Database**: SQLite by default (MySQL supported via `DATABASE_URL`)
- **Authentication**: JWT

## Database
Automatically initialized on first backend run. Database schema available in `backend/tripwise.sql`.

## Environment Variables
The default database is `sqlite:///./test.db`, stored in the backend directory.
Set `DATABASE_URL` to override it, for example:

```env
DATABASE_URL=mysql+mysqlconnector://user:password@localhost:3306/tripwise_db
```
