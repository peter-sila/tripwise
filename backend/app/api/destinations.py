"""
Destination API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import DestinationResponse, DestinationSearch
from app.services.destination_service import DestinationService

router = APIRouter(prefix="/api/destinations", tags=["destinations"])


@router.get("", response_model=dict)
async def list_destinations(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    List all destinations with pagination
    
    Query parameters:
        - limit: Number of results to return (default: 100, max: 1000)
        - offset: Number of results to skip (default: 0)
    
    Returns:
        List of destinations
    """
    destinations = DestinationService.get_all_destinations(db, limit=limit, offset=offset)
    return {
        "success": True,
        "data": [DestinationResponse.model_validate(d) for d in destinations],
        "limit": limit,
        "offset": offset
    }


@router.get("/search", response_model=dict)
async def search_destinations(
    query: str = Query(None),
    category: str = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Search destinations by query and/or category
    
    Query parameters:
        - query: Search query (searches in name, description, location)
        - category: Filter by category
        - limit: Number of results to return (default: 10, max: 100)
        - offset: Number of results to skip (default: 0)
    
    Returns:
        List of matching destinations
    """
    search_params = DestinationSearch(
        query=query,
        category=category,
        limit=limit,
        offset=offset
    )
    
    destinations = DestinationService.search_destinations(db, search_params)
    
    return {
        "success": True,
        "data": [DestinationResponse.model_validate(d) for d in destinations],
        "query": query,
        "category": category,
        "count": len(destinations)
    }


@router.get("/{destination_id}", response_model=dict)
async def get_destination(destination_id: int, db: Session = Depends(get_db)):
    """
    Get destination by ID
    
    Path parameters:
        - destination_id: ID of the destination
    
    Returns:
        Destination data
    """
    destination = DestinationService.get_destination(db, destination_id)
    
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    return {
        "success": True,
        "data": DestinationResponse.model_validate(destination)
    }
