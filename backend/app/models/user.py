"""
User model
"""
from sqlalchemy import Column, String, Boolean, Index, Enum, JSON
from app.models.base import BaseModel


class User(BaseModel):
    """User model for authentication and user management"""
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    name = Column(String(255), nullable=False)
    role = Column(Enum('user', 'admin', 'super_admin', name='user_roles'), nullable=True, index=True, default='user')
    permissions = Column(JSON, nullable=True)
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    oauth_provider = Column(String(50), nullable=True)
    oauth_email = Column(String(255), nullable=True)
    
    __table_args__ = (
        Index('idx_users_email', 'email'),
        Index('idx_users_google_id', 'google_id'),
        Index('idx_users_role', 'role'),
    )
    
    @property
    def is_admin(self):
        return self.role in ('admin', 'super_admin')

    @property
    def is_active(self):
        return True

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"
