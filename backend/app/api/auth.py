"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import base64
import json
import requests
from app.database import get_db
from app.services.user_service import UserService
from app.utils.jwt_handler import create_access_token
from app.middleware.auth import get_current_user
from app.models.user import User
from app.utils.response_formatter import model_to_dict


def serialize_user(user: User) -> dict:
    user_data = model_to_dict(user)
    user_data['is_admin'] = user.is_admin
    user_data['is_active'] = user.is_active
    return user_data

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_data: dict, db: Session = Depends(get_db)):
    """
    Register a new user
    
    Request body:
        - email: User email
        - name: User full name
        - password: User password
    
    Returns:
        Access token and user data
    """
    try:
        user = UserService.create_user(db, user_data)
        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": serialize_user(user)
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=dict)
async def login(login_data: dict, db: Session = Depends(get_db)):
    """
    Login user with email and password
    
    Request body:
        - email: User email
        - password: User password
    
    Returns:
        Access token and user data
    """
    try:
        email = login_data.get("email")
        password = login_data.get("password")
        user = UserService.authenticate_user(db, email, password)
        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": serialize_user(user)
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Returns:
        Current user data
    """
    return {
        "success": True,
        "data": serialize_user(current_user)
    }


@router.get("/verify", response_model=dict)
async def verify_token(current_user: User = Depends(get_current_user)):
    """
    Verify if token is valid
    
    Returns:
        Success message and user data
    """
    return {
        "success": True,
        "valid": True,
        "message": "Token is valid",
        "user": serialize_user(current_user)
    }


@router.post("/google", response_model=dict)
# @router.post("/google-oauth", response_model=dict)
async def google_oauth(token_request: dict, db: Session = Depends(get_db)):
    """
    Authenticate user with Google OAuth credentials
    
    Request body:
        - id_token: Google ID token from frontend
        - access_token: Google OAuth access token from frontend
    
    Returns:
        Access token and user data
    """
    try:
        id_token = token_request.get("id_token")
        access_token_value = token_request.get('access_token')
        if not id_token and not access_token_value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing id_token or access_token"
            )

        if access_token_value:
            try:
                userinfo_response = requests.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    headers={'Authorization': f'Bearer {access_token_value}'},
                    timeout=10
                )
                if userinfo_response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail='Invalid Google access token'
                    )
                payload = userinfo_response.json()
            except requests.RequestException as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f'Failed to verify Google access token: {str(e)}'
                )
        else:
            token_parts = id_token.split('.')
            if len(token_parts) != 3:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token format"
                )

            payload_part = token_parts[1]
            padding = 4 - len(payload_part) % 4
            if padding != 4:
                payload_part += '=' * padding

            try:
                payload = json.loads(
                    base64.urlsafe_b64decode(payload_part)
                )
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )

        google_id = payload.get('sub')
        email = payload.get('email')
        name = payload.get('name', 'Google User')

        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing required fields in token"
            )

        user = UserService.get_or_create_google_user(
            db,
            google_id=google_id,
            email=email,
            name=name
        )

        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": serialize_user(user)
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

        if 'name' in profile_data and profile_data['name']:
            current_user.name = profile_data['name']

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
            "data": serialize_user(current_user)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )
