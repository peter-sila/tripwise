"""
Travel Tip model
"""
from sqlalchemy import Column, String, Text, Integer, ForeignKey, Index
from app.models.base import BaseModel


class TravelTip(BaseModel):
    """Travel tip model for user-submitted travel tips"""
    __tablename__ = "travel_tips"
    
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100))
    
    __table_args__ = (
        Index('idx_travel_tips_user_id', 'user_id'),
        Index('idx_travel_tips_category', 'category'),
    )
    
    def __repr__(self):
        return f"<TravelTip(id={self.id}, title={self.title}, user_id={self.user_id})>"
