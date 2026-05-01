# Code Implementation Guide

## Backend Code Structure & Implementation Details

### 1. Authentication Implementation

#### User Model (`app/models/user.py`)
```python
from sqlalchemy import Column, String, Boolean, Index
from app.models.base import BaseModel

class User(BaseModel):
    """User model for authentication and user management"""
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # NULL for OAuth
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    google_id = Column(String(255), unique=True, nullable=True, index=True)
```

#### Password Hashing (`app/utils/password_handler.py`)
```python
import bcrypt

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hash_value: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hash_value.encode('utf-8'))
```

#### JWT Handler (`app/utils/jwt_handler.py`)
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from config.settings import settings

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            hours=settings.jwt_expiration_hours
        )
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt

def decode_token(token: str):
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        user_id = payload.get("sub")
        if user_id is None:
            return None
        return user_id
    except JWTError:
        return None
```

#### Authentication Middleware (`app/middleware/auth.py`)
```python
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.jwt_handler import decode_token

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user
    Extracts token from header, verifies it, and returns user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id = decode_token(token)
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user
```

#### Auth Routes (`app/api/auth.py`)
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register new user
    - Validates email and password strength
    - Hashes password before storing
    - Creates JWT token
    - Returns token and user data
    """
    try:
        user = UserService.create_user(db, user_data)
        access_token = create_access_token(data={"sub": user.id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    User login
    - Finds user by email
    - Verifies password hash
    - Creates JWT token
    """
    try:
        user = UserService.authenticate_user(db, login_data.email, login_data.password)
        access_token = create_access_token(data={"sub": user.id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post("/google", response_model=GoogleAuthResponse)
async def google_oauth(token_request: GoogleTokenRequest, db: Session = Depends(get_db)):
    """
    Google OAuth authentication
    - Decodes Google JWT token
    - Extracts google_id, email, name
    - Gets or creates user
    - Returns JWT access token
    """
    # Decode Google token
    payload = decode_google_token(token_request.id_token)
    
    # Get or create user
    user = UserService.get_or_create_google_user(
        db,
        google_id=payload['sub'],
        email=payload['email'],
        name=payload.get('name', 'Google User')
    )
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }
```

---

### 2. Destination Management

#### Destination Model (`app/models/destination.py`)
```python
from sqlalchemy import Column, String, Text, Float

class Destination(BaseModel):
    __tablename__ = "destinations"
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    country = Column(String(255), index=True)
    category = Column(String(100), index=True)
    image_url = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
```

#### Destination Service (`app/services/destination_service.py`)
```python
from sqlalchemy.orm import Session
from sqlalchemy import or_

class DestinationService:
    @staticmethod
    def get_all_destinations(db: Session, limit: int = 100, offset: int = 0):
        """Get all destinations with pagination"""
        return db.query(Destination).offset(offset).limit(limit).all()
    
    @staticmethod
    def search_destinations(db: Session, search_params: DestinationSearch):
        """
        Search destinations by query and category
        - Full-text search on name, description, location
        - Optional category filter
        - Pagination support
        """
        query = db.query(Destination)
        
        # Apply search filter
        if search_params.query:
            query = query.filter(
                or_(
                    Destination.name.ilike(f"%{search_params.query}%"),
                    Destination.description.ilike(f"%{search_params.query}%"),
                    Destination.location.ilike(f"%{search_params.query}%")
                )
            )
        
        # Apply category filter
        if search_params.category:
            query = query.filter(Destination.category == search_params.category)
        
        # Apply pagination
        query = query.offset(search_params.offset).limit(search_params.limit)
        
        return query.all()
    
    @staticmethod
    def get_destination(db: Session, destination_id: int):
        """Get single destination by ID"""
        return db.query(Destination).filter(
            Destination.id == destination_id
        ).first()
```

#### Destination Routes (`app/api/destinations.py`)
```python
from fastapi import APIRouter, Depends, HTTPException, status, Query

router = APIRouter(prefix="/api/destinations", tags=["destinations"])

@router.get("", response_model=dict)
async def list_destinations(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """List all destinations with pagination"""
    destinations = DestinationService.get_all_destinations(
        db, limit=limit, offset=offset
    )
    
    return {
        "success": True,
        "data": [DestinationResponse.model_validate(d) for d in destinations],
        "limit": limit,
        "offset": offset
    }

@router.get("/search", response_model=dict)
async def search_destinations(
    query: str = Query(None),
    category: str = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Search destinations by query and category"""
    search_params = DestinationSearch(
        query=query,
        category=category,
        limit=limit,
        offset=offset
    )
    
    destinations = DestinationService.search_destinations(db, search_params)
    
    return {
        "success": True,
        "data": [DestinationResponse.model_validate(d) for d in destinations],
        "query": query,
        "category": category,
        "count": len(destinations)
    }

@router.get("/{destination_id}", response_model=dict)
async def get_destination(
    destination_id: int,
    db: Session = Depends(get_db)
):
    """Get destination details by ID"""
    destination = DestinationService.get_destination(db, destination_id)
    
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    return {
        "success": True,
        "data": DestinationResponse.model_validate(destination)
    }
```

---

### 3. Trip Planning with AI

#### Trip Plan Model (`app/models/trip_plan.py`)
```python
from sqlalchemy import Column, String, Text, Date, Integer
from sqlalchemy.orm import relationship

class TripPlan(BaseModel):
    __tablename__ = "trip_plans"
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    
    # Relationship
    user = relationship("User", back_populates="trip_plans")
```

#### AI Trip Service (`app/services/ai_trip_service.py`)
```python
import openai
from config.settings import settings

class AITripService:
    @staticmethod
    def validate_preferences(preferences: dict) -> tuple:
        """
        Validate user preferences
        Returns: (is_valid: bool, message: str)
        """
        required_fields = ['destination', 'duration_days']
        
        for field in required_fields:
            if not preferences.get(field):
                return False, f"{field} is required"
        
        try:
            duration = int(preferences['duration_days'])
            if duration < 1 or duration > 365:
                return False, "Duration must be between 1 and 365 days"
        except ValueError:
            return False, "Duration must be a number"
        
        return True, "Valid"
    
    @staticmethod
    def generate_trip_plan(preferences: dict) -> dict:
        """
        Generate trip plan using OpenAI API
        Returns: Structured trip plan with itinerary items
        """
        # Build prompt
        prompt = f"""
        Create a detailed {preferences['duration_days']}-day travel itinerary for {preferences['destination']}.
        
        Travel preferences:
        - Budget: {preferences.get('budget', 'moderate')}
        - Style: {preferences.get('travel_style', 'balanced')}
        - Group size: {preferences.get('group_size', 1)} people
        - Interests: {', '.join(preferences.get('interests', []))}
        - Accommodation: {preferences.get('accommodation', 'hotel')}
        
        Return response as JSON with:
        {{
          "title": "Trip title",
          "description": "Trip description",
          "start_date": "2024-06-01",
          "end_date": "2024-06-05",
          "items": [
            {{
              "date": "2024-06-01",
              "time": "10:00",
              "title": "Activity",
              "description": "Description"
            }}
          ]
        }}
        """
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Extract and parse response
        content = response['choices'][0]['message']['content']
        
        # Parse JSON from response
        trip_data = json.loads(content)
        
        return trip_data
```

#### Trip Plan Service (`app/services/trip_plan_service.py`)
```python
class TripPlanService:
    @staticmethod
    def create_trip_plan(db: Session, user_id: int, plan_data: TripPlanCreate):
        """Create new trip plan for user"""
        trip_plan = TripPlan(
            user_id=user_id,
            title=plan_data.title,
            description=plan_data.description,
            start_date=plan_data.start_date,
            end_date=plan_data.end_date
        )
        
        db.add(trip_plan)
        db.commit()
        db.refresh(trip_plan)
        
        return trip_plan
    
    @staticmethod
    def get_user_trip_plans(db: Session, user_id: int):
        """Get all trip plans for a user"""
        return db.query(TripPlan).filter(
            TripPlan.user_id == user_id
        ).order_by(TripPlan.created_at.desc()).all()
    
    @staticmethod
    def get_trip_plan(db: Session, plan_id: int, user_id: int):
        """Get specific trip plan (with ownership check)"""
        return db.query(TripPlan).filter(
            TripPlan.id == plan_id,
            TripPlan.user_id == user_id
        ).first()
    
    @staticmethod
    def update_trip_plan(
        db: Session,
        plan_id: int,
        user_id: int,
        update_data: TripPlanUpdate
    ):
        """Update trip plan (with ownership check)"""
        trip_plan = TripPlanService.get_trip_plan(db, plan_id, user_id)
        
        if not trip_plan:
            raise ValueError("Trip plan not found or unauthorized")
        
        # Update fields
        update_fields = update_data.dict(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(trip_plan, field, value)
        
        db.commit()
        db.refresh(trip_plan)
        
        return trip_plan
    
    @staticmethod
    def delete_trip_plan(db: Session, plan_id: int, user_id: int):
        """Delete trip plan (with ownership check)"""
        trip_plan = TripPlanService.get_trip_plan(db, plan_id, user_id)
        
        if not trip_plan:
            raise ValueError("Trip plan not found or unauthorized")
        
        db.delete(trip_plan)
        db.commit()
```

#### Trip Plan Routes (`app/api/trip_plans.py`)
```python
@router.post("/generate-with-ai", status_code=status.HTTP_201_CREATED)
async def generate_trip_with_ai(
    preferences: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI trip plan"""
    try:
        # Validate preferences
        is_valid, message = AITripService.validate_preferences(preferences)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        # Generate trip plan
        trip_data = AITripService.generate_trip_plan(preferences)
        
        # Optionally save to database
        if preferences.get('auto_save', False):
            plan_create = TripPlanCreate(
                title=trip_data.get('title', 'AI Generated Trip'),
                description=trip_data.get('description', ''),
                start_date=trip_data.get('start_date'),
                end_date=trip_data.get('end_date')
            )
            trip_plan = TripPlanService.create_trip_plan(
                db, current_user.id, plan_create
            )
            return {
                "success": True,
                "message": "Trip plan generated and saved successfully",
                "data": TripPlanResponse.model_validate(trip_plan)
            }
        
        return {
            "success": True,
            "message": "Trip plan generated successfully",
            "data": trip_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
```

---

### 4. Reviews & Ratings

#### Review Model (`app/models/review.py`)
```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey

class Review(BaseModel):
    __tablename__ = "reviews"
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    destination_id = Column(Integer, ForeignKey('destinations.id'), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text)
    
    user = relationship("User")
    destination = relationship("Destination")
```

#### Review Routes (`app/api/contact_and_reviews.py`)
```python
@review_router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new review for destination"""
    # Validate rating
    if not 1 <= review_data.rating <= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    # Check destination exists
    destination = db.query(Destination).filter(
        Destination.id == review_data.destination_id
    ).first()
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    # Create review
    review = Review(
        user_id=current_user.id,
        destination_id=review_data.destination_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    return {
        "success": True,
        "message": "Review created successfully",
        "data": ReviewResponse.model_validate(review)
    }

@review_router.get("", response_model=dict)
async def get_reviews(
    destination_id: int = Query(None),
    limit: int = Query(100),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    """Get reviews (optionally filtered by destination)"""
    query = db.query(Review)
    
    if destination_id:
        query = query.filter(Review.destination_id == destination_id)
    
    reviews = query.offset(offset).limit(limit).all()
    
    return {
        "success": True,
        "data": [ReviewResponse.model_validate(r) for r in reviews]
    }
```

---

## Frontend Code Structure & Implementation

### 1. Authentication Flow (Frontend)

#### API Service Calls
```javascript
// API base configuration
const API_BASE = 'http://localhost:8000/api';

// Register
async function register(email, password, name) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userInfo', JSON.stringify(data.user));
  }
  
  return data;
}

// Login
async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userInfo', JSON.stringify(data.user));
  }
  
  return data;
}

// Get current user
async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    return await response.json();
  }
  
  throw new Error('Failed to fetch user');
}
```

#### Component State Management
```javascript
// In NavBar or Profile component
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);

// On component mount
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchUser(token);
  }
}, []);

const fetchUser = async (token) => {
  try {
    const userData = await getCurrentUser(token);
    setUser(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    localStorage.removeItem('token');
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  setUser(null);
};
```

### 2. Destination Discovery

#### Search Implementation
```javascript
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);
const searchTimeoutRef = useRef(null);

const handleSearch = (query) => {
  setSearchQuery(query);
  
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  if (!query.trim()) {
    setSearchResults([]);
    return;
  }
  
  setIsSearching(true);
  
  // Debounce search request
  searchTimeoutRef.current = setTimeout(async () => {
    try {
      const response = await fetch(
        `${API_BASE}/destinations/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setSearchResults(data.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300); // Debounce for 300ms
};
```

#### Destination Details
```javascript
const [destination, setDestination] = useState(null);
const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchDestinationDetails();
  fetchReviews();
}, [destinationId]);

const fetchDestinationDetails = async () => {
  try {
    const response = await fetch(
      `${API_BASE}/destinations/${destinationId}`
    );
    const data = await response.json();
    
    if (response.ok && data.data) {
      setDestination(data.data);
    }
  } catch (error) {
    console.error('Error fetching destination:', error);
  } finally {
    setLoading(false);
  }
};

const fetchReviews = async () => {
  try {
    const response = await fetch(
      `${API_BASE}/reviews?destination_id=${destinationId}`
    );
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      setReviews(data.data);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};
```

### 3. Trip Planning

#### AI Trip Generation
```javascript
const [generatingPlan, setGeneratingPlan] = useState(false);
const [generatedPlan, setGeneratedPlan] = useState(null);

const generateAITrip = async (preferences) => {
  setGeneratingPlan(true);
  
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in first');
      return;
    }
    
    const response = await fetch(
      `${API_BASE}/trip-plans/generate-with-ai`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...preferences,
          auto_save: true  // Save immediately
        })
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      setGeneratedPlan(data.data);
      alert('Trip plan generated and saved!');
    } else {
      alert(`Error: ${data.detail}`);
    }
  } catch (error) {
    console.error('Error generating trip:', error);
    alert('Failed to generate trip plan');
  } finally {
    setGeneratingPlan(false);
  }
};
```

---

## Error Handling Patterns

### Backend Error Handling
```python
# Pattern: Try-Catch with HTTPException
try:
    # Business logic
    result = perform_operation()
    return {"success": True, "data": result}
except ValueError as e:
    # Client errors (validation, not found)
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=str(e)
    )
except PermissionError as e:
    # Authorization errors
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=str(e)
    )
except Exception as e:
    # Server errors
    logger.error(f"Error: {str(e)}")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Internal server error"
    )
```

### Frontend Error Handling
```javascript
// Pattern: Try-Catch with user-friendly messages
try {
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    // Handle API errors
    const errorMsg = data.detail || data.message || 'Unknown error';
    throw new Error(errorMsg);
  }
  
  // Process successful response
  return data;
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly message
  setError(error.message || 'An error occurred');
  return null;
}
```

---

**Code Guide Version**: 1.0
**Last Updated**: May 2024
