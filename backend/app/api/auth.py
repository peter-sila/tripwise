"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
import base64
import json
from app.database import get_db
from app.schemas import UserCreate, UserLogin, Token, UserResponse
from app.services.user_service import UserService
from app.utils.jwt_handler import create_access_token
from app.middleware.auth import get_current_user
from app.models.user import User
from config.settings import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


# Request models
class GoogleTokenRequest(BaseModel):
    """Google OAuth token request"""
    id_token: str
    
    
class GoogleAuthResponse(BaseModel):
    """Google OAuth response"""
    access_token: str
    token_type: str
    user: UserResponse


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


@router.post("/google", response_model=GoogleAuthResponse, status_code=status.HTTP_200_OK)
async def google_oauth(token_request: GoogleTokenRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with Google OAuth token
    
    Request body:
        - id_token: Google ID token from frontend
    
    Returns:
        Access token and user data
    """
    try:
        # Decode and validate Google token
        # Note: In production, verify the signature with Google's public keys
        # For development, we decode and validate basic structure
        
        token_parts = token_request.id_token.split('.')
        if len(token_parts) != 3:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format"
            )
        
        # Decode the payload (second part)
        # Add padding if necessary
        payload_part = token_parts[1]
        padding = 4 - len(payload_part) % 4
        if padding != 4:
            payload_part += '=' * padding
        
        try:
            payload = json.loads(
                base64.urlsafe_b64decode(payload_part)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Extract user information
        google_id = payload.get('sub')
        email = payload.get('email')
        name = payload.get('name', 'Google User')
        
        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing required fields in token"
            )
        
        # Get or create user
        user = UserService.get_or_create_google_user(
            db,
            google_id=google_id,
            email=email,
            name=name
        )
        
        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )


@router.put("/profile", response_model=dict, status_code=status.HTTP_200_OK)
async def update_user_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile
    
    Request body:
        - name: New user name (optional)
        - currentPassword: Current password for validation (required if changing password)
        - newPassword: New password (optional)
    
    Returns:
        Updated user data
    """
    try:
        from app.utils.password_handler import verify_password, hash_password
        
        # Update name if provided
        if 'name' in profile_data and profile_data['name']:
            current_user.name = profile_data['name']
        
        # Handle password change
        if profile_data.get('newPassword'):
            current_password = profile_data.get('currentPassword')
            
            if not current_password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password required to change password"
                )
            
            if not verify_password(current_password, current_user.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Current password is incorrect"
                )
            
            current_user.password_hash = hash_password(profile_data['newPassword'])
        
        db.commit()
        db.refresh(current_user)
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": UserResponse.model_validate(current_user)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )
