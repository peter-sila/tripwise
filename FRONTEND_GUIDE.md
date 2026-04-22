# Frontend Code Guide

## Overview
The frontend is a React application built with Vite that provides a user interface for the TripWise travel application. It features multiple pages for browsing destinations, reading reviews, exploring travel tips, and planning trips.

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx          # React application entry point
│   ├── App.jsx           # Main app component with routing
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── users/            # User-facing pages and components
│   │   ├── AIPlanner.jsx       # Trip planning page with AI assistance
│   │   ├── destinations.jsx    # Browse and filter destinations
│   │   ├── discover.jsx        # Search and discover experiences
│   │   ├── reviews.jsx         # View and leave destination reviews
│   │   ├── travelTips.jsx      # Browse travel advice and tips
│   │   ├── statics/            # Reusable static components
│   │   │   ├── navbar.jsx      # Navigation bar (appears on all pages)
│   │   │   └── footer.jsx      # Footer (appears on all pages)
│   │   └── css/                # Page-specific stylesheets
│   │       ├── index.css       # Global styles
│   │       ├── navbar.css
│   │       ├── footer.css
│   │       ├── destinations.css
│   │       ├── discover.css
│   │       ├── reviews.css
│   │       ├── traveltips.css
│   │       └── aiplanner.css
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.js    # Vite build configuration
```

## Key Concepts

### API Communication
All pages communicate with the backend through RESTful API calls using the `fetch()` API:
- Base URL: `http://localhost:8000/backend/api`
- All responses are JSON format
- Authorization uses Bearer tokens (stored in localStorage)

### State Management
Each page uses React hooks for state management:
- `useState()` - Manage component state (data, loading, filters, etc.)
- `useEffect()` - Fetch data from API when component mounts or dependencies change
- `useMemo()` - Optimize filtering and sorting operations

### Error Handling
- API failures are caught and logged to console
- Components gracefully show empty states if data cannot be loaded
- User-friendly error messages are displayed where applicable

## Page Components

### 1. Destinations Page (`destinations.jsx`)

**Purpose**: Display and filter travel destinations

**Features**:
- Browse all destinations with categories (hotels, restaurants, activities)
- Filter destinations by category
- Show destination details with ratings
- Expandable cards with more information

**API Calls**:
- GET `/destinations.php` - Fetch all destinations
- GET `/destinations.php?category=<category>` - Filter by category

**State Variables**:
- `destinations` - Array of all destinations from database
- `loading` - Loading state for data fetching
- `activeCategory` - Currently selected category filter

**User Interactions**:
- Click category buttons to filter destinations
- View destination details by clicking on cards

---

### 2. Discover Page (`discover.jsx`)

**Purpose**: Search and explore destinations with filtering

**Features**:
- Search destinations by name or description
- Filter by category (nature, culture, adventure, food, shopping)
- Toggle between list and map view (UI ready, backend integration needed)
- Add destinations to favorites (client-side only, not persisted)

**API Calls**:
- GET `/destinations.php?search=<query>&category=<category>` - Search with filters

**State Variables**:
- `discoveries` - Filtered destination results
- `searchTerm` - Current search text
- `activeCategory` - Selected category filter
- `favorites` - Array of favorite destination IDs
- `loading` - Loading state

**User Interactions**:
- Type in search bar to find destinations
- Click category buttons to filter
- Heart icon to add/remove favorites

---

### 3. Reviews Page (`reviews.jsx`)

**Purpose**: View and leave reviews for destinations

**Features**:
- View all reviews for a selected destination
- Filter reviews by minimum rating
- Sort reviews (helpful, rating, recent)
- See average rating and total review count
- Create new reviews (UI ready, backend integration available)

**API Calls**:
- GET `/destinations.php` - Get list of destinations
- GET `/reviews.php?destination_id=<id>` - Get reviews for destination
- POST `/reviews.php` - Submit new review (requires authentication)

**State Variables**:
- `reviews` - Reviews for selected destination
- `destinations` - List of all destinations (for selector)
- `selectedDestination` - Currently selected destination
- `sortBy` - Sort order (recent, helpful, rating)
- `filterRating` - Minimum rating filter

**User Interactions**:
- Select destination from dropdown
- Sort and filter reviews
- Leave a review (requires authentication)

---

### 4. Travel Tips Page (`travelTips.jsx`)

**Purpose**: Browse travel advice and tips from the community

**Features**:
- View travel tips organized by category
- Expand/collapse tip cards
- Filter by category (packing, safety, budget, health, culture, transport)
- See tip author and creation date

**API Calls**:
- GET `/travelTips.php` - Get all tips
- GET `/travelTips.php?category=<category>` - Get tips by category

**State Variables**:
- `tips` - Array of travel tips
- `loading` - Loading state
- `selectedCategory` - Active category filter
- `expandedTip` - ID of currently expanded tip

**User Interactions**:
- Click category buttons to filter tips
- Click tip header to expand/collapse details
- View author and date information

---

### 5. AI Planner Page (`AIPlanner.jsx`)

**Purpose**: Create and manage personalized trip plans

**Features**:
- View all user's trip plans
- Create new trip plan with title, dates, and description
- Add destinations and activities to plans
- View trip itinerary with timeline
- (AI features to be implemented)

**API Calls**:
- GET `/aiPlanner.php` - Get user's trip plans (requires auth)
- POST `/aiPlanner.php` - Create new trip plan (requires auth)

**State Variables**:
- `tripPlans` - User's trip plans with details
- `loading` - Loading state
- `showForm` - Show/hide create trip form
- `formData` - Form input values (title, dates, description)

**User Interactions**:
- Click "Create Plan" button to show form
- Fill in trip details and submit
- View list of existing plans

---

### 6. Navigation Components

#### Navbar (`statics/navbar.jsx`)
- Appears at top of every page
- Navigation links to all main pages
- Logo/branding
- User profile/login area (UI ready)

#### Footer (`statics/footer.jsx`)
- Appears at bottom of every page
- Company information
- Links
- Contact information
- Social media links

## Common Patterns

### Data Fetching Pattern
```javascript
// 1. Initialize state
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

// 2. Fetch data on mount or when dependency changes
useEffect(() => {
  fetchData();
}, [dependency]);

// 3. Define fetch function
const fetchData = async () => {
  try {
    const response = await fetch(`${API_BASE}/endpoint.php?params`);
    const result = await response.json();
    setData(result.dataKey);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

// 4. Render based on state
if (loading) return <div>Loading...</div>;
if (data.length === 0) return <div>No data</div>;
return <div>{/* render data */}</div>;
```

### Filtering Pattern
```javascript
// Use useMemo for efficient filtering
const filtered = useMemo(() => {
  if (!filter) return data;
  return data.filter(item => item.category === filter);
}, [filter, data]);
```

## Styling

Each page has its own CSS file for styling. Global styles are in `index.css`.

**CSS Conventions**:
- BEM naming for CSS classes
- Mobile-first responsive design
- Uses CSS Grid and Flexbox for layouts
- Variables for colors, spacing, typography

## State Management Best Practices

1. **Keep state local** - Use component state unless data is shared
2. **Use useEffect cleanup** - Cancel API requests if component unmounts
3. **Avoid state updates in render** - Only in useEffect or event handlers
4. **Memoize expensive computations** - Use useMemo for filtering/sorting

## Frontend to Backend Communication

### API Base URL
```javascript
const API_BASE = 'http://localhost:8000/backend/api';
```

### Common Response Patterns
```javascript
// Success response
{ data_key: [...], message: "..." }

// Error response
{ error: "Error message" }

// Create response
{ message: "...", id: <new_id> }
```

### Authentication
```javascript
// Store token after login
localStorage.setItem('token', token);

// Use token in authenticated requests
const token = localStorage.getItem('token');
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Remove token on logout
localStorage.removeItem('token');
```

## Performance Considerations

1. **Lazy Loading** - Data loads on page navigation, not all at once
2. **Memoization** - Filtering/sorting results cached with useMemo
3. **Error Handling** - Failed API calls don't crash the app
4. **Loading States** - Users see loading indicators while data fetches

## Future Enhancements

1. Add authentication UI (login/register pages)
2. Implement user profile pages
3. Add pagination for large datasets
4. Client-side state management (Redux/Context API)
5. Implement image preview functionality
6. Add favorites persistence (save to backend)
7. Real-time notifications
8. Offline support with service workers
9. AI recommendations based on preferences
10. Integration with payment gateways

## Troubleshooting

### API Errors
- Check browser console for error messages
- Verify backend server is running on port 8000
- Confirm API URLs match backend endpoints

### CORS Issues
- Ensure CORS is enabled in backend config
- Check API URL includes correct port number

### Data Not Loading
- Check network tab in browser DevTools
- Verify database has data to fetch
- Confirm API endpoint returns correct response format

### Component Not Updating
- Check state dependencies in useEffect
- Verify API response format matches expected structure
- Use React DevTools to inspect component state

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## File Naming Conventions

- Page components: lowercase with .jsx extension (destinations.jsx)
- Utility components: lowercase (navbar.jsx)
- CSS files: match component name with .css extension
- Hooks: useXxxx naming convention
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

## Code Style

- Use functional components with React Hooks
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and small
- Export at end of file
- Use destructuring for props
