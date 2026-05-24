"""
User service for business logic
"""
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.password_handler import hash_password, verify_password
from app.utils.validators import validate_email, validate_password


class UserService:
    """Service for user operations"""
    
    @staticmethod
    def create_user(db: Session, user_data: dict) -> User:
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
        email = user_data.get("email")
        name = user_data.get("name")
        password = user_data.get("password")

        if not validate_email(email):
            raise ValueError("Invalid email format")

        is_valid, error_msg = validate_password(password)
        if not is_valid:
            raise ValueError(error_msg)

        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError("Email already registered")

        user = User(
            email=email,
            name=name,
            password_hash=hash_password(password)
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
        user = db.query(User).filter(User.google_id == google_id).first()
        if user:
            return user

        user = db.query(User).filter(User.email == email).first()
        if user:
            if not user.google_id:
                user.google_id = google_id
                db.commit()
                db.refresh(user)
            return user

        user = User(
            email=email,
            name=name,
            google_id=google_id,
            password_hash=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
