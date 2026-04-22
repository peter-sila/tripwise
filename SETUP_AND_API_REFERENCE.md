# TripWise - Quick Start & API Reference Guide

## Quick Start Guide

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Node.js 14+ and npm
- Git (for version control)

### Initial Setup (5 minutes)

#### 1. Database Setup
```bash
# Create MySQL database from SQL file
mysql -u root -p < backend/db/tripwise.sql

# Or manually in MySQL client
CREATE DATABASE tripwise;
USE tripwise;
SOURCE backend/db/tripwise.sql;
```

#### 2. Configure Backend
```bash
# Edit backend/config/constants.php
<?php
$host = 'localhost';
$db = 'tripwise';
$user = 'root';
$pass = 'your_mysql_password'; // Add your password
?>
```

#### 3. Start PHP Backend Server
```bash
cd d:\wise\tripwise
php -S localhost:8000
# Server now running at http://localhost:8000
```

#### 4. Setup & Start React Frontend
```bash
cd frontend
npm install  # Install dependencies first time only
npm run dev
# Frontend now running at http://localhost:5173
```

#### 5. Verify Installation
- Open http://localhost:5173 in browser
- Navigate to Destinations page
- Should show "No destinations" (database is empty)

### Populate Test Data

Insert test data to verify everything works:

```sql
-- Insert sample users
INSERT INTO users (email, password_hash, name) VALUES
('user@example.com', '$2y$10$Keuv8.WXd8n3Fq.h2TDBCO2YxPnFb6r.lClmLI5nWLb6sJBzX6RNm', 'Test User');
-- Password is 'password123' hashed

-- Insert sample destinations
INSERT INTO destinations (name, description, location, category) VALUES
('Serena Safari Lodge', 'Luxury wildlife lodge with stunning savanna views', 'Masai Mara', 'accommodation'),
('Nairobi National Park', 'Wildlife viewing experience near the capital', 'Nairobi', 'activity'),
('The Carnivore Restaurant', 'Authentic Kenyan dining experience', 'Nairobi', 'gastronomy');

-- Insert sample travel tips
INSERT INTO travel_tips (user_id, title, content, category) VALUES
(1, 'Pack Light Colors for Safari', 'Neutral colors help you blend into the environment for better wildlife photography', 'packing'),
(1, 'Stay Hydrated in Kenya', 'Drink plenty of water - the sun is intense and hydration is essential', 'health');

-- Insert sample reviews
INSERT INTO reviews (user_id, destination_id, rating, comment) VALUES
(1, 1, 5, 'Amazing experience! The guides were knowledgeable and accommodations were comfortable.'),
(1, 2, 4, 'Great wildlife viewing. Saw lions, zebras, and giraffes!');
```

## API Reference

### Base URL
```
http://localhost:8000/backend/api/
```

### Response Format
All responses are JSON. Successful responses return data, errors return:
```json
{ "error": "Error message" }
```

---

## Authentication API

### Register New User
**Endpoint:** `POST /auth.php`

**Request:**
```json
{
  "action": "register",
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful",
  "user_id": 1
}
```

**Errors:**
- `400` - Missing fields or validation error
- `409` - Email already registered

---

### Login User
**Endpoint:** `POST /auth.php`

**Request:**
```json
{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "1"
}
```

**Errors:**
- `400` - Missing fields
- `401` - Invalid credentials

---

### Get Current User
**Endpoint:** `GET /auth.php`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `401` - Invalid or missing token

---

### Logout
**Endpoint:** `POST /auth.php`

**Request:**
```json
{
  "action": "logout"
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## Destinations API

### List All Destinations
**Endpoint:** `GET /destinations.php`

**Query Parameters:**
- `search` (optional) - Search term (searches name, description, location)
- `category` (optional) - Category filter (accommodation, gastronomy, activity)

**Examples:**
```
GET /destinations.php
GET /destinations.php?category=accommodation
GET /destinations.php?search=safari
GET /destinations.php?search=restaurant&category=gastronomy
```

**Response (200 OK):**
```json
{
  "destinations": [
    {
      "id": 1,
      "name": "Serena Safari Lodge",
      "description": "Luxury lodge with stunning views...",
      "location": "Masai Mara",
      "image_url": "https://...",
      "category": "accommodation",
      "created_at": "2024-04-20 10:30:00"
    }
  ]
}
```

---

### Create New Destination
**Endpoint:** `POST /destinations.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Amboseli National Park",
  "description": "Stunning views of Mount Kilimanjaro...",
  "location": "Amboseli",
  "category": "activity",
  "image_url": "https://..."
}
```

**Response (201 Created):**
```json
{
  "message": "Destination added successfully",
  "id": 4
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Not authenticated

---

## Reviews API

### Get Reviews for Destination
**Endpoint:** `GET /reviews.php`

**Query Parameters:**
- `destination_id` (required) - ID of destination

**Example:**
```
GET /reviews.php?destination_id=1
```

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": 1,
      "user_id": 1,
      "destination_id": 1,
      "rating": 5,
      "comment": "Amazing experience!",
      "user_name": "John Doe",
      "created_at": "2024-04-20 14:20:00"
    }
  ]
}
```

---

### Create Review
**Endpoint:** `POST /reviews.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "destination_id": 1,
  "rating": 5,
  "comment": "Wonderful experience! Would visit again."
}
```

**Response (201 Created):**
```json
{
  "message": "Review added successfully"
}
```

**Errors:**
- `400` - Missing fields or invalid rating
- `401` - Not authenticated

---

## Travel Tips API

### Get Travel Tips
**Endpoint:** `GET /travelTips.php`

**Query Parameters:**
- `category` (optional) - Filter by category (packing, safety, budget, health, culture, transport)

**Examples:**
```
GET /travelTips.php
GET /travelTips.php?category=packing
GET /travelTips.php?category=safety
```

**Response (200 OK):**
```json
{
  "travel_tips": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Pack Light Colors for Safari",
      "content": "Neutral colors help blend into the environment...",
      "category": "packing",
      "user_name": "Travel Expert",
      "created_at": "2024-04-20 09:00:00"
    }
  ]
}
```

---

### Create Travel Tip
**Endpoint:** `POST /travelTips.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Best Time to Visit Kenya",
  "content": "The best time to visit Kenya is during the dry seasons...",
  "category": "packing"
}
```

**Response (201 Created):**
```json
{
  "message": "Travel tip added successfully"
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Not authenticated

---

## Trip Planner API

### Get User's Trip Plans
**Endpoint:** `GET /aiPlanner.php`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "trip_plans": [
    {
      "id": 1,
      "user_id": 1,
      "title": "5-Day Safari Adventure",
      "description": "Explore Masai Mara wildlife",
      "start_date": "2024-06-01",
      "end_date": "2024-06-05",
      "created_at": "2024-04-20 15:30:00",
      "items": [
        {
          "id": 1,
          "trip_plan_id": 1,
          "destination_id": 1,
          "title": "Arrive at lodge",
          "date": "2024-06-01",
          "time": "14:00:00"
        }
      ]
    }
  ]
}
```

---

### Create Trip Plan
**Endpoint:** `POST /aiPlanner.php`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "5-Day Nairobi City Tour",
  "description": "Explore the capital city",
  "start_date": "2024-06-10",
  "end_date": "2024-06-14",
  "items": [
    {
      "title": "Visit Nairobi Museum",
      "destination_id": 2,
      "date": "2024-06-10",
      "time": "10:00:00"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Trip plan created successfully",
  "plan_id": 2
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Not authenticated

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or missing fields |
| 401 | Unauthorized - Authentication required or invalid token |
| 404 | Not Found - Resource not found |
| 405 | Method Not Allowed - Wrong HTTP method |
| 409 | Conflict - Resource already exists (e.g., email) |
| 500 | Server Error - Unexpected server error |

---

## Testing with cURL

### Test GET Request
```bash
curl http://localhost:8000/backend/api/destinations.php
```

### Test POST with JSON
```bash
curl -X POST http://localhost:8000/backend/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{"action":"register","email":"test@example.com","password":"test123","name":"Test User"}'
```

### Test Authenticated Request
```bash
curl http://localhost:8000/backend/api/aiPlanner.php \
  -H "Authorization: Bearer 1"
```

---

## Common Issues & Solutions

### CORS Errors
**Problem:** "Access to fetch has been blocked by CORS policy"

**Solution:**
- Ensure PHP server running on port 8000
- Verify CORS headers enabled in config/config.php
- Check API URL uses correct port and path

### 404 Errors
**Problem:** "GET /backend/api/destinations.php 404"

**Solution:**
- PHP server must be started from `d:\wise\tripwise` directory
- API path should be `/backend/api/` not `/tripwise/backend/api/`
- Check PHP server is running

### Authentication Failures
**Problem:** "401 Unauthorized"

**Solution:**
- Verify token is included in Authorization header
- Token format must be: `Bearer <token>`
- Check token is valid (currently just user ID)

### Database Connection Errors
**Problem:** "Database connection failed"

**Solution:**
- Verify MySQL is running
- Check credentials in constants.php match your setup
- Ensure `tripwise` database exists
- Run tripwise.sql to create tables

---

## Performance Tips

1. **Use pagination** for large datasets (implement in future version)
2. **Cache responses** on client side (frontend already implements)
3. **Index database columns** (already done in schema)
4. **Minimize API calls** by fetching only needed data
5. **Use filtering** at database level, not in frontend

---

## Security Checklist

- ✓ Passwords hashed with bcrypt
- ✓ Input sanitized to prevent XSS
- ✓ Prepared statements prevent SQL injection
- ✓ CORS headers configured
- ✓ Authentication required for sensitive operations
- ⚠️ TODO: Implement JWT for better token security
- ⚠️ TODO: Rate limiting for API endpoints
- ⚠️ TODO: HTTPS enforced in production

---

## Next Steps

1. Add test data to database (see "Populate Test Data" section)
2. Test frontend pages load without errors
3. Implement authentication UI (login/register forms)
4. Add more destinations and tips to database
5. Test all API endpoints with provided examples

Happy coding! 🚀
