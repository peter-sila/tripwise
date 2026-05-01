"""
Contact message model
"""
from sqlalchemy import Column, String, Text
from app.models.base import BaseModel


class ContactMessage(BaseModel):
    """Contact message model for storing contact form submissions"""
    __tablename__ = "contact_messages"
    
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    
    def __repr__(self):
        return f"<ContactMessage(id={self.id}, email={self.email}, subject={self.subject})>"
