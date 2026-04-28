"""
Trip Plan API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import TripPlanCreate, TripPlanUpdate, TripPlanResponse
from app.services.trip_plan_service import TripPlanService
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/trip-plans", tags=["trip-plans"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_trip_plan(
    plan_data: TripPlanCreate,
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
            "data": TripPlanResponse.model_validate(trip_plan)
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
        "data": [TripPlanResponse.model_validate(plan) for plan in trip_plans]
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
        "data": TripPlanResponse.model_validate(trip_plan)
    }


@router.put("/{plan_id}", response_model=dict)
async def update_trip_plan(
    plan_id: int,
    plan_data: TripPlanUpdate,
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
        "data": TripPlanResponse.model_validate(trip_plan)
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
