"""
Trip Plan and Trip Plan Item models
"""
from sqlalchemy import Column, String, Text, Date, Time, Integer, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class TripPlan(BaseModel):
    """Trip plan model for storing user trip plans"""
    __tablename__ = "trip_plans"
    
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    
    # Relationship
    items = relationship("TripPlanItem", back_populates="trip_plan", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_trip_plans_user_id', 'user_id'),
    )
    
    def __repr__(self):
        return f"<TripPlan(id={self.id}, title={self.title}, user_id={self.user_id})>"


class TripPlanItem(BaseModel):
    """Trip plan item model for storing activities/destinations in a trip plan"""
    __tablename__ = "trip_plan_items"
    
    trip_plan_id = Column(Integer, ForeignKey('trip_plans.id', ondelete='CASCADE'), nullable=False)
    destination_id = Column(Integer, ForeignKey('destinations.id', ondelete='SET NULL'), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    date = Column(Date)
    time = Column(Time)
    
    # Relationship
    trip_plan = relationship("TripPlan", back_populates="items")
    
    __table_args__ = (
        Index('idx_trip_plan_items_trip_plan_id', 'trip_plan_id'),
        Index('idx_trip_plan_items_destination_id', 'destination_id'),
    )
    
    def __repr__(self):
        return f"<TripPlanItem(id={self.id}, title={self.title}, trip_plan_id={self.trip_plan_id})>"
