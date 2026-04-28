"""
Initialize API routers
"""
from fastapi import APIRouter
from app.api import auth, destinations, trip_plans, contact_and_reviews

# Create main API router
api_router = APIRouter()

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(destinations.router)
api_router.include_router(trip_plans.router)
api_router.include_router(contact_and_reviews.contact_router)
api_router.include_router(contact_and_reviews.review_router)

__all__ = ["api_router"]
