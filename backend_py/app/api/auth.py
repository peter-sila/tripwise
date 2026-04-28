"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.schemas import UserCreate, UserLogin, Token, UserResponse
from app.services.user_service import UserService
from app.utils.jwt_handler import create_access_token
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    Request body:
        - email: User email
        - name: User full name
        - password: User password (min 8 chars, uppercase, lowercase, numbers)
    
    Returns:
        Access token and user data
    """
    try:
        user = UserService.create_user(db, user_data)
        
        # Create access token
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
    Login user with email and password
    
    Request body:
        - email: User email
        - password: User password
    
    Returns:
        Access token and user data
    """
    try:
        user = UserService.authenticate_user(db, login_data.email, login_data.password)
        
        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Returns:
        Current user data
    """
    return UserResponse.model_validate(current_user)


@router.get("/verify", response_model=dict)
async def verify_token(current_user: User = Depends(get_current_user)):
    """
    Verify if token is valid
    
    Returns:
        Success message and user data
    """
    return {
        "valid": True,
        "message": "Token is valid",
        "user": UserResponse.model_validate(current_user)
    }
