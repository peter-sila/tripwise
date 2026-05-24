"""
Trip Plan API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database import get_db
from app.services.trip_plan_service import TripPlanService
from app.services.ai_trip_service import AITripService
from app.middleware.auth import get_current_user
from app.models.user import User
from app.utils.response_formatter import model_to_dict

router = APIRouter(prefix="/api/trip-plans", tags=["trip-plans"])


@router.post("/generate-with-ai", response_model=dict, status_code=status.HTTP_201_CREATED)
async def generate_trip_with_ai(
    preferences: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a trip plan using AI based on user preferences
    
    Request body:
        - destination: Destination name (required)
        - duration_days: Number of days (required)
        - start_date: Trip start date in YYYY-MM-DD format (optional)
        - budget: Budget level - "budget", "moderate", or "luxury" (optional)
        - travel_style: Travel style - "adventure", "relaxation", "cultural", etc. (optional)
        - group_size: Number of travelers (optional)
        - interests: List of interests/activities (optional)
        - accommodation: Accommodation preference (optional)
        - auto_save: Whether to auto-save the generated plan (optional, default: false)
    
    Returns:
        Generated trip plan data
    """
    try:
        is_valid, message = AITripService.validate_preferences(preferences)
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)

        trip_data = AITripService.generate_trip_plan(preferences)

        if preferences.get('auto_save', False):
            plan_data = {
                "title": trip_data.get('title', 'AI Generated Trip'),
                "description": trip_data.get('description', ''),
                "start_date": trip_data.get('start_date'),
                "end_date": trip_data.get('end_date'),
                "items": trip_data.get('items', [])
            }
            trip_plan = TripPlanService.create_trip_plan(db, current_user.id, plan_data)
            return {
                "success": True,
                "message": "Trip plan generated and saved successfully",
                "data": model_to_dict(trip_plan)
            }

        return {
            "success": True,
            "message": "Trip plan generated successfully",
            "data": trip_data
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_trip_plan(
    plan_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new trip plan
    
    Request body:
        - title: Trip plan title (required)
        - description: Trip plan description (optional)
        - start_date: Trip start date (optional)
        - end_date: Trip end date (optional)
        - items: List of trip plan items (optional)
    
    Returns:
        Created trip plan data
    """
    try:
        trip_plan = TripPlanService.create_trip_plan(db, current_user.id, plan_data)
        return {
            "success": True,
            "message": "Trip plan created successfully",
            "data": model_to_dict(trip_plan)
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("", response_model=dict)
async def get_trip_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all trip plans for current user
    
    Returns:
        List of user's trip plans
    """
    trip_plans = TripPlanService.get_user_trip_plans(db, current_user.id)

    return {
        "success": True,
        "data": [model_to_dict(plan) for plan in trip_plans]
    }


@router.get("/{plan_id}", response_model=dict)
async def get_trip_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific trip plan
    
    Path parameters:
        - plan_id: ID of the trip plan
    
    Returns:
        Trip plan data
    """
    trip_plan = TripPlanService.get_trip_plan(db, plan_id, current_user.id)

    if not trip_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip plan not found"
        )

    return {
        "success": True,
        "data": model_to_dict(trip_plan)
    }


@router.put("/{plan_id}", response_model=dict)
async def update_trip_plan(
    plan_id: int,
    plan_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a trip plan
    
    Path parameters:
        - plan_id: ID of the trip plan
    
    Request body:
        - title: Updated trip plan title (optional)
        - description: Updated description (optional)
        - start_date: Updated start date (optional)
        - end_date: Updated end date (optional)
        - items: Updated list of trip plan items (optional)
    
    Returns:
        Updated trip plan data
    """
    trip_plan = TripPlanService.update_trip_plan(db, plan_id, current_user.id, plan_data)

    if not trip_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip plan not found"
        )

    return {
        "success": True,
        "message": "Trip plan updated successfully",
        "data": model_to_dict(trip_plan)
    }


@router.delete("/{plan_id}", response_model=dict)
async def delete_trip_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a trip plan
    
    Path parameters:
        - plan_id: ID of the trip plan
    
    Returns:
        Success message
    """
    success = TripPlanService.delete_trip_plan(db, plan_id, current_user.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip plan not found"
        )

    return {
        "success": True,
        "message": "Trip plan deleted successfully"
    }
