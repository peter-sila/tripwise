"""
Base model with common fields
"""
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer
from app.database import Base


class BaseModel(Base):
    """Base model with common fields for all models"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
