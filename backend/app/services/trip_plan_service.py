"""
Trip plan service for business logic
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date
from typing import List, Optional
from app.models.trip_plan import TripPlan, TripPlanItem
from app.schemas import TripPlanCreate, TripPlanUpdate


class TripPlanService:
    """Service for trip plan operations"""
    
    @staticmethod
    def create_trip_plan(db: Session, user_id: int, plan_data: TripPlanCreate) -> TripPlan:
        """
        Create a new trip plan
        
        Args:
            db: Database session
            user_id: User ID
            plan_data: Trip plan creation data
        
        Returns:
            Created trip plan object
        """
        # Create trip plan
        trip_plan = TripPlan(
            user_id=user_id,
            title=plan_data.title,
            description=plan_data.description,
            start_date=plan_data.start_date,
            end_date=plan_data.end_date
        )
        db.add(trip_plan)
        db.flush()
        
        # Add items if provided
        if plan_data.items:
            for item_data in plan_data.items:
                item = TripPlanItem(
                    trip_plan_id=trip_plan.id,
                    title=item_data.title,
                    description=item_data.description,
                    destination_id=item_data.destination_id,
                    date=item_data.date,
                    time=item_data.time
                )
                db.add(item)
        
        db.commit()
        db.refresh(trip_plan)
        return trip_plan
    
    @staticmethod
    def get_trip_plan(db: Session, plan_id: int, user_id: int) -> Optional[TripPlan]:
        """
        Get trip plan by ID (verify ownership)
        
        Args:
            db: Database session
            plan_id: Trip plan ID
            user_id: User ID (for ownership verification)
        
        Returns:
            Trip plan object or None
        """
        return db.query(TripPlan).filter(
            and_(TripPlan.id == plan_id, TripPlan.user_id == user_id)
        ).first()
    
    @staticmethod
    def get_user_trip_plans(db: Session, user_id: int) -> List[TripPlan]:
        """
        Get all trip plans for a user
        
        Args:
            db: Database session
            user_id: User ID
        
        Returns:
            List of trip plans
        """
        return db.query(TripPlan).filter(TripPlan.user_id == user_id).order_by(
            TripPlan.created_at.desc()
        ).all()
    
    @staticmethod
    def update_trip_plan(db: Session, plan_id: int, user_id: int, plan_data: TripPlanUpdate) -> Optional[TripPlan]:
        """
        Update a trip plan
        
        Args:
            db: Database session
            plan_id: Trip plan ID
            user_id: User ID
            plan_data: Trip plan update data
        
        Returns:
            Updated trip plan or None
        """
        trip_plan = TripPlanService.get_trip_plan(db, plan_id, user_id)
        if not trip_plan:
            return None
        
        # Update fields
        if plan_data.title is not None:
            trip_plan.title = plan_data.title
        if plan_data.description is not None:
            trip_plan.description = plan_data.description
        if plan_data.start_date is not None:
            trip_plan.start_date = plan_data.start_date
        if plan_data.end_date is not None:
            trip_plan.end_date = plan_data.end_date
        
        # Update items if provided
        if plan_data.items is not None:
            # Delete existing items
            db.query(TripPlanItem).filter(TripPlanItem.trip_plan_id == plan_id).delete()
            
            # Add new items
            for item_data in plan_data.items:
                item = TripPlanItem(
                    trip_plan_id=plan_id,
                    title=item_data.title,
                    description=item_data.description,
                    destination_id=item_data.destination_id,
                    date=item_data.date,
                    time=item_data.time
                )
                db.add(item)
        
        db.commit()
        db.refresh(trip_plan)
        return trip_plan
    
    @staticmethod
    def delete_trip_plan(db: Session, plan_id: int, user_id: int) -> bool:
        """
        Delete a trip plan
        
        Args:
            db: Database session
            plan_id: Trip plan ID
            user_id: User ID
        
        Returns:
            True if deleted, False if not found
        """
        trip_plan = TripPlanService.get_trip_plan(db, plan_id, user_id)
        if not trip_plan:
            return False
        
        db.delete(trip_plan)
        db.commit()
        return True
