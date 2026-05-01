"""
User service for business logic
"""
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.password_handler import hash_password, verify_password
from app.utils.validators import validate_email, validate_password
from app.schemas import UserCreate, UserLogin


class UserService:
    """Service for user operations"""
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """
        Create a new user
        
        Args:
            db: Database session
            user_data: User creation data
        
        Returns:
            Created user object
        
        Raises:
            ValueError: If user already exists or validation fails
        """
        # Validate email
        if not validate_email(user_data.email):
            raise ValueError("Invalid email format")
        
        # Validate password strength
        is_valid, error_msg = validate_password(user_data.password)
        if not is_valid:
            raise ValueError(error_msg)
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("Email already registered")
        
        # Create new user
        user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=hash_password(user_data.password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        """
        Get user by email
        
        Args:
            db: Database session
            email: User email
        
        Returns:
            User object or None
        """
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        """
        Get user by ID
        
        Args:
            db: Database session
            user_id: User ID
        
        Returns:
            User object or None
        """
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """
        Authenticate user by email and password
        
        Args:
            db: Database session
            email: User email
            password: User password
        
        Returns:
            User object if authenticated
        
        Raises:
            ValueError: If authentication fails
        """
        user = UserService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password")
        return user
    
    @staticmethod
    def get_or_create_google_user(db: Session, google_id: str, email: str, name: str) -> User:
        """
        Get or create user from Google OAuth data
        
        Args:
            db: Database session
            google_id: Google user ID from token
            email: User email from Google
            name: User name from Google
        
        Returns:
            User object (existing or newly created)
        """
        # Try to find user by google_id first
        user = db.query(User).filter(User.google_id == google_id).first()
        if user:
            return user
        
        # Check if email already exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Update google_id if not set
            if not user.google_id:
                user.google_id = google_id
                db.commit()
                db.refresh(user)
            return user
        
        # Create new user with google OAuth
        user = User(
            email=email,
            name=name,
            google_id=google_id,
            password_hash=None  # No password for OAuth users
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
