"""
Destination service for business logic
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.destination import Destination


class DestinationService:
    """Service for destination operations"""
    
    @staticmethod
    def create_destination(db: Session, destination_data: dict) -> Destination:
        """
        Create a new destination
        
        Args:
            db: Database session
            destination_data: Destination creation data
        
        Returns:
            Created destination object
        """
        destination = Destination(
            name=destination_data.get("name"),
            description=destination_data.get("description"),
            location=destination_data.get("location"),
            image_url=destination_data.get("image_url"),
            category=destination_data.get("category")
        )
        db.add(destination)
        db.commit()
        db.refresh(destination)
        return destination
    
    @staticmethod
    def get_destination(db: Session, destination_id: int) -> Optional[Destination]:
        """
        Get destination by ID
        
        Args:
            db: Database session
            destination_id: Destination ID
        
        Returns:
            Destination object or None
        """
        return db.query(Destination).filter(Destination.id == destination_id).first()
    
    @staticmethod
    def get_all_destinations(db: Session, limit: int = 100, offset: int = 0) -> List[Destination]:
        """
        Get all destinations with pagination
        
        Args:
            db: Database session
            limit: Number of results to return
            offset: Number of results to skip
        
        Returns:
            List of destinations
        """
        return db.query(Destination).offset(offset).limit(limit).all()
    
    @staticmethod
    def search_destinations(db: Session, query_text: str = None, category: str = None, limit: int = 10, offset: int = 0) -> List[Destination]:
        """
        Search destinations by query and/or category
        
        Args:
            db: Database session
            query_text: Search query text
            category: Filter category
            limit: Number of results to return
            offset: Number of results to skip
        
        Returns:
            List of matching destinations
        """
        query = db.query(Destination)
        
        if query_text:
            search_term = f"%{query_text}%"
            query = query.filter(
                or_(
                    Destination.name.ilike(search_term),
                    Destination.description.ilike(search_term),
                    Destination.location.ilike(search_term)
                )
            )
        
        if category:
            query = query.filter(Destination.category == category)
        
        query = query.offset(offset).limit(limit)
        return query.all()
    
    @staticmethod
    def get_destinations_by_category(db: Session, category: str, limit: int = 100) -> List[Destination]:
        """
        Get destinations by category
        
        Args:
            db: Database session
            category: Destination category
            limit: Maximum number of results
        
        Returns:
            List of destinations in category
        """
        return db.query(Destination).filter(
            Destination.category == category
        ).limit(limit).all()
