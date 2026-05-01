"""
Review model
"""
from sqlalchemy import Column, String, Text, Integer, ForeignKey, Index, CheckConstraint
from app.models.base import BaseModel


class Review(BaseModel):
    """Review model for user reviews on destinations"""
    __tablename__ = "reviews"
    
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    destination_id = Column(Integer, ForeignKey('destinations.id', ondelete='CASCADE'), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
        Index('idx_reviews_user_id', 'user_id'),
        Index('idx_reviews_destination_id', 'destination_id'),
    )
    
    def __repr__(self):
        return f"<Review(id={self.id}, user_id={self.user_id}, destination_id={self.destination_id}, rating={self.rating})>"
