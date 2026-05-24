"""
Contact and Reviews API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.contact import ContactMessage
from app.models.review import Review
from app.middleware.auth import get_current_user
from app.models.user import User
from app.utils.response_formatter import model_to_dict

contact_router = APIRouter(prefix="/api/contact", tags=["contact"])
review_router = APIRouter(prefix="/api/reviews", tags=["reviews"])


# ===== Contact Routes =====
@contact_router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def submit_contact_message(contact_data: dict, db: Session = Depends(get_db)):
    """
    Submit a contact message
    
    Request body:
        - name: Sender name (required)
        - email: Sender email (required)
        - phone: Sender phone number (optional)
        - subject: Message subject (required)
        - message: Message content (required)
    
    Returns:
        Confirmation message
    """
    contact = ContactMessage(
        name=contact_data.get("name"),
        email=contact_data.get("email"),
        phone=contact_data.get("phone"),
        subject=contact_data.get("subject"),
        message=contact_data.get("message")
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)

    return {
        "success": True,
        "message": "Message sent successfully",
        "data": model_to_dict(contact)
    }


@contact_router.get("", response_model=dict)
async def get_contact_messages(
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get all contact messages (admin only in production)
    
    Query parameters:
        - limit: Number of results
        - offset: Pagination offset
    
    Returns:
        List of contact messages
    """
    messages = db.query(ContactMessage).offset(offset).limit(limit).all()

    return {
        "success": True,
        "data": [model_to_dict(m) for m in messages]
    }


# ===== Review Routes =====
@review_router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new review for a destination
    
    Request body:
        - destination_id: ID of the destination (required)
        - rating: Review rating 1-5 (required)
        - comment: Review comment (optional)
    
    Returns:
        Created review data
    """
    review = Review(
        user_id=current_user.id,
        destination_id=review_data.get("destination_id"),
        rating=review_data.get("rating"),
        comment=review_data.get("comment")
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "success": True,
        "message": "Review created successfully",
        "data": model_to_dict(review)
    }


@review_router.get("/destination/{destination_id}", response_model=dict)
async def get_destination_reviews(
    destination_id: int,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get all reviews for a destination
    
    Path parameters:
        - destination_id: ID of the destination
    
    Query parameters:
        - limit: Number of results
        - offset: Pagination offset
    
    Returns:
        List of reviews and average rating
    """
    reviews = db.query(Review).filter(
        Review.destination_id == destination_id
    ).offset(offset).limit(limit).all()

    if not reviews:
        avg_rating = 0
    else:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)

    return {
        "success": True,
        "destination_id": destination_id,
        "average_rating": round(avg_rating, 1),
        "total_reviews": len(reviews),
        "data": [model_to_dict(r) for r in reviews]
    }
