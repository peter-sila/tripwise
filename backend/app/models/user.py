"""
User model
"""
from sqlalchemy import Column, String, Boolean, Index
from app.models.base import BaseModel


class User(BaseModel):
    """User model for authentication and user management"""
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    
    __table_args__ = (
        Index('idx_users_email', 'email'),
    )
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"
