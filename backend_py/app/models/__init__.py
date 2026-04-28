"""
Import all models for database initialization
"""
from app.models.base import BaseModel
from app.models.user import User
from app.models.destination import Destination
from app.models.trip_plan import TripPlan, TripPlanItem
from app.models.review import Review
from app.models.travel_tip import TravelTip
from app.models.contact import ContactMessage

__all__ = [
    "BaseModel",
    "User",
    "Destination",
    "TripPlan",
    "TripPlanItem",
    "Review",
    "TravelTip",
    "ContactMessage",
]
