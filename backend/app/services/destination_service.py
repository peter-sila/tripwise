"""
Destination service for business logic
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.destination import Destination
from app.schemas import DestinationCreate, DestinationSearch


class DestinationService:
    """Service for destination operations"""
    
    @staticmethod
    def create_destination(db: Session, destination_data: DestinationCreate) -> Destination:
        """
        Create a new destination
        
        Args:
            db: Database session
            destination_data: Destination creation data
        
        Returns:
            Created destination object
        """
        destination = Destination(
            name=destination_data.name,
            description=destination_data.description,
            location=destination_data.location,
            image_url=destination_data.image_url,
            category=destination_data.category
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
    def search_destinations(db: Session, search_params: DestinationSearch) -> List[Destination]:
        """
        Search destinations by query and/or category
        
        Args:
            db: Database session
            search_params: Search parameters
        
        Returns:
            List of matching destinations
        """
        query = db.query(Destination)
        
        # Apply text search
        if search_params.query:
            search_term = f"%{search_params.query}%"
            query = query.filter(
                or_(
                    Destination.name.ilike(search_term),
                    Destination.description.ilike(search_term),
                    Destination.location.ilike(search_term)
                )
            )
        
        # Apply category filter
        if search_params.category:
            query = query.filter(Destination.category == search_params.category)
        
        # Apply pagination
        query = query.offset(search_params.offset).limit(search_params.limit)
        
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
