# TripWise Project Documentation

## Project Overview
TripWise is a full-stack travel planning application for Kenya that allows users to explore destinations, read and write reviews, get travel tips, and plan AI-powered trips. The application features both a modern React frontend and a PHP backend with MySQL database.

## Technology Stack
- **Frontend**: React 18+ with Vite, Lucide React icons, modern CSS
- **Backend**: PHP 7.4+, PDO for database access
- **Database**: MySQL
- **Communication**: RESTful API with JSON, CORS enabled for cross-origin requests

## Project Structure

```
tripwise/
├── backend/                    # PHP backend application
│   ├── api/                   # API endpoints
│   │   ├── auth.php          # Authentication endpoints (login, register, logout)
│   │   ├── destinations.php  # Destinations CRUD operations
│   │   ├── reviews.php       # Reviews management
│   │   ├── travelTips.php    # Travel tips endpoints
│   │   └── aiPlanner.php     # Trip planning endpoints
│   ├── config/
│   │   ├── config.php        # Database config & CORS setup
│   │   └── constants.php     # Environment variables
│   ├── includes/
│   │   └── auth.php          # Authentication & utility functions
│   └── db/
│       └── tripwise.sql      # Database schema
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── main.jsx         # Entry point
│   │   └── users/           # User-facing pages
│   │       ├── AIPlanner.jsx     # AI trip planner page
│   │       ├── destinations.jsx  # Destinations listing page
│   │       ├── discover.jsx      # Discovery/search page
│   │       ├── reviews.jsx       # Reviews page
│   │       ├── travelTips.jsx    # Travel tips page
│   │       ├── css/              # Page-specific styles
│   │       └── statics/
│   │           ├── navbar.jsx    # Navigation bar
│   │           └── footer.jsx    # Footer component
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
├── README.md                # Basic project info
└── PROJECT_DOCUMENTATION.md # This file
```

## Database Schema

### Users Table
Stores user account information for authentication and profile management.
- `id`: Primary key
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `name`: User display name
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Destinations Table
Stores travel destination information.
- `id`: Primary key
- `name`: Destination name
- `description`: Detailed description
- `location`: Geographic location
- `image_url`: Image URL
- `category`: Category (accommodation, gastronomy, activity)
- `created_at`: Creation timestamp

### Reviews Table
Stores user reviews for destinations.
- `id`: Primary key
- `user_id`: Foreign key to users table
- `destination_id`: Foreign key to destinations table
- `rating`: Rating from 1-5
- `comment`: Review text
- `created_at`: Creation timestamp

### Travel Tips Table
Stores travel advice and tips from users.
- `id`: Primary key
- `user_id`: Foreign key to users table
- `title`: Tip title
- `content`: Detailed tip content
- `category`: Category (packing, safety, budget, health, culture, transport)
- `created_at`: Creation timestamp

### Trip Plans Table
Stores user trip plans.
- `id`: Primary key
- `user_id`: Foreign key to users table
- `title`: Trip plan name
- `description`: Trip description
- `start_date`: Trip start date
- `end_date`: Trip end date
- `created_at`: Creation timestamp

### Trip Plan Items Table
Stores individual items/activities within a trip plan.
- `id`: Primary key
- `trip_plan_id`: Foreign key to trip_plans table
- `destination_id`: Foreign key to destinations table
- `title`: Activity/item title
- `description`: Activity description
- `date`: Activity date
- `time`: Activity time
- `created_at`: Creation timestamp

## API Endpoints

### Authentication Endpoints (`/backend/api/auth.php`)

#### POST - Login
- **URL**: `/backend/api/auth.php`
- **Payload**: `{ action: "login", email, password }`
- **Response**: `{ user, token }`

#### POST - Register
- **URL**: `/backend/api/auth.php`
- **Payload**: `{ action: "register", email, password, name }`
- **Response**: `{ message, user_id }`

#### POST - Logout
- **URL**: `/backend/api/auth.php`
- **Payload**: `{ action: "logout" }`
- **Response**: `{ message }`

#### GET - Get Current User
- **URL**: `/backend/api/auth.php`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user }`

### Destinations Endpoints (`/backend/api/destinations.php`)

#### GET - List Destinations
- **URL**: `/backend/api/destinations.php?search=<term>&category=<category>`
- **Query Params**: Optional `search` and `category` filters
- **Response**: `{ destinations: [...] }`

#### POST - Add Destination
- **URL**: `/backend/api/destinations.php`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `{ name, description, location, image_url, category }`
- **Response**: `{ message, id }`

### Reviews Endpoints (`/backend/api/reviews.php`)

#### GET - Get Reviews for Destination
- **URL**: `/backend/api/reviews.php?destination_id=<id>`
- **Query Params**: `destination_id` (required)
- **Response**: `{ reviews: [...] }`

#### POST - Add Review
- **URL**: `/backend/api/reviews.php`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `{ destination_id, rating (1-5), comment }`
- **Response**: `{ message }`

### Travel Tips Endpoints (`/backend/api/travelTips.php`)

#### GET - Get Travel Tips
- **URL**: `/backend/api/travelTips.php?category=<category>`
- **Query Params**: Optional `category` filter
- **Response**: `{ travel_tips: [...] }`

#### POST - Add Travel Tip
- **URL**: `/backend/api/travelTips.php`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `{ title, content, category }`
- **Response**: `{ message }`

### Trip Planner Endpoints (`/backend/api/aiPlanner.php`)

#### GET - Get User's Trip Plans
- **URL**: `/backend/api/aiPlanner.php`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ trip_plans: [...] }`

#### POST - Create Trip Plan
- **URL**: `/backend/api/aiPlanner.php`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `{ title, description, start_date, end_date, items: [...] }`
- **Response**: `{ message, plan_id }`

## Frontend Pages

### Pages Overview

1. **Destinations** (`destinations.jsx`)
   - Displays available destinations
   - Allows filtering by category
   - Shows destination details and ratings

2. **Discover** (`discover.jsx`)
   - Search and filter destinations
   - Browse by categories
   - Add to favorites

3. **Reviews** (`reviews.jsx`)
   - View community reviews for destinations
   - Filter by rating
   - See average ratings

4. **Travel Tips** (`travelTips.jsx`)
   - Browse travel advice and tips
   - Filter by category (packing, safety, budget, etc.)
   - Expandable tip cards for detailed information

5. **AI Planner** (`AIPlanner.jsx`)
   - Create and manage trip plans
   - Plan activities and destinations
   - View trip timeline

## Setup & Installation

### Backend Setup
1. Create MySQL database:
   ```bash
   mysql -u root -p < backend/db/tripwise.sql
   ```

2. Update database credentials in `backend/config/constants.php`

3. Start PHP server:
   ```bash
   cd d:\wise\tripwise
   php -S localhost:8000
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Key Features

### Authentication
- User registration and login with password hashing (bcrypt)
- Simple token-based authentication (can be upgraded to JWT)
- Protected API endpoints requiring authorization

### Destinations Management
- Browse all destinations with categories
- Search destinations by name, description, location
- Filter by category (accommodation, gastronomy, activity)

### Reviews System
- Users can rate destinations (1-5 stars)
- Write detailed reviews
- View average ratings per destination
- Sort reviews by helpful, rating, or recent

### Travel Tips
- Community-contributed travel advice
- Categorized tips (packing, safety, budget, health, culture, transport)
- Expandable tip cards for better readability

### Trip Planning
- Create custom trip plans
- Add destinations and activities to plans
- Set dates and times for activities
- View complete trip itinerary

## Security Considerations

1. **Password Security**: Uses bcrypt hashing for password storage
2. **Input Validation**: Sanitizes and validates all user inputs
3. **CORS**: Enabled for cross-origin requests between frontend and backend
4. **Database Access**: Uses PDO with parameterized queries to prevent SQL injection
5. **Token Authentication**: Bearer token system for protected endpoints

## Environment Variables

Create `backend/config/constants.php`:
```php
<?php
$host = 'localhost';
$db = 'tripwise';
$user = 'root';
$pass = ''; // Your MySQL password
?>
```

## Performance Optimizations

1. **Database Indexes**: Indexed foreign keys for faster queries
2. **API Caching**: Frontend caches destination and tips data
3. **Lazy Loading**: Pages load data on-demand via API
4. **Error Handling**: Graceful fallback to empty states on API failure

## Future Enhancements

1. Implement JWT (JSON Web Tokens) for better token management
2. Add user profile pages and activity history
3. Implement pagination for large datasets
4. Add image upload functionality with cloud storage
5. Implement advanced search with filters
6. Add user notifications system
7. Create admin dashboard for content management
8. Add social features (follow users, likes, comments)
9. Implement AI-powered trip recommendations
10. Add payment integration for booking features

## Troubleshooting

### CORS Errors
- Ensure PHP server is running on port 8000
- Check CORS headers are enabled in `config/config.php`
- Verify API URLs use correct domain and port

### Database Connection Errors
- Verify MySQL is running
- Check credentials in `constants.php`
- Ensure database is created with schema

### Frontend API Errors
- Check browser console for error messages
- Verify backend server is running
- Confirm API endpoints are accessible via Postman/curl

## Contributing

1. Create a new branch for features
2. Add comments to all new code
3. Test features before submitting
4. Update documentation for significant changes

## License

Private project for TripWise

## Contact & Support

For issues or questions, please contact the development team.
