"""
Destination model
"""
from sqlalchemy import Column, String, Text, Index
from app.models.base import BaseModel


class Destination(BaseModel):
    """Destination model for storing travel destinations"""
    __tablename__ = "destinations"
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    image_url = Column(String(500))
    category = Column(String(100))
    
    __table_args__ = (
        Index('idx_destinations_name', 'name'),
        Index('idx_destinations_category', 'category'),
    )
    
    def __repr__(self):
        return f"<Destination(id={self.id}, name={self.name}, category={self.category})>"
