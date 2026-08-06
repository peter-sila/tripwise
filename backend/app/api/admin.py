"""
Admin API routes for global application management.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.review import Review
from app.models.trip_plan import TripPlan
from app.models.contact import ContactMessage
from app.models.destination import Destination
from app.utils.response_formatter import model_to_dict

router = APIRouter(prefix="/api/admin", tags=["admin"])


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/stats", response_model=dict)
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    user_count = db.query(User).count()
    destination_count = db.query(Destination).count()
    trip_plan_count = db.query(TripPlan).count()
    review_count = db.query(Review).count()
    contact_count = db.query(ContactMessage).count()

    return {
        "success": True,
        "data": {
            "users": user_count,
            "destinations": destination_count,
            "trip_plans": trip_plan_count,
            "reviews": review_count,
            "contact_messages": contact_count
        }
    }


@router.get("/users", response_model=dict)
async def list_users(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    users = db.query(User).order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return {
        "success": True,
        "data": [model_to_dict(user) for user in users]
    }


@router.delete("/users/{user_id}", response_model=dict)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete current admin user")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(user)
    db.commit()
    return {"success": True, "message": "User deleted successfully"}


@router.get("/trip-plans", response_model=dict)
async def list_trip_plans(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    trip_plans = db.query(TripPlan).order_by(TripPlan.created_at.desc()).offset(offset).limit(limit).all()
    return {
        "success": True,
        "data": [model_to_dict(plan) for plan in trip_plans]
    }


@router.delete("/trip-plans/{plan_id}", response_model=dict)
async def delete_trip_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    plan = db.query(TripPlan).filter(TripPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip plan not found")
    db.delete(plan)
    db.commit()
    return {"success": True, "message": "Trip plan deleted successfully"}


@router.get("/reviews", response_model=dict)
async def list_reviews(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    reviews = db.query(Review).order_by(Review.created_at.desc()).offset(offset).limit(limit).all()
    return {
        "success": True,
        "data": [model_to_dict(review) for review in reviews]
    }


@router.delete("/reviews/{review_id}", response_model=dict)
async def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"success": True, "message": "Review deleted successfully"}


@router.get("/contact-messages", response_model=dict)
async def list_contact_messages(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).offset(offset).limit(limit).all()
    return {
        "success": True,
        "data": [model_to_dict(message) for message in messages]
    }


@router.delete("/contact-messages/{message_id}", response_model=dict)
async def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found")
    db.delete(message)
    db.commit()
    return {"success": True, "message": "Contact message deleted successfully"}
