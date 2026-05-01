"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, time


# ===== User Schemas =====
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: str
    
    class Config:
        from_attributes = True


# ===== Destination Schemas =====
class DestinationBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None


class DestinationCreate(DestinationBase):
    pass


class DestinationResponse(DestinationBase):
    id: int
    created_at: str
    
    class Config:
        from_attributes = True


class DestinationSearch(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    limit: int = Field(10, ge=1, le=100)
    offset: int = Field(0, ge=0)


# ===== Trip Plan Item Schemas =====
class TripPlanItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    destination_id: Optional[int] = None
    date: Optional[date] = None
    time: Optional[time] = None


class TripPlanItemCreate(TripPlanItemBase):
    pass


class TripPlanItemResponse(TripPlanItemBase):
    id: int
    trip_plan_id: int
    created_at: str
    
    class Config:
        from_attributes = True


# ===== Trip Plan Schemas =====
class TripPlanBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class TripPlanCreate(TripPlanBase):
    items: Optional[List[TripPlanItemCreate]] = []


class TripPlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    items: Optional[List[TripPlanItemCreate]] = None


class TripPlanResponse(TripPlanBase):
    id: int
    user_id: int
    created_at: str
    updated_at: str
    items: List[TripPlanItemResponse] = []
    
    class Config:
        from_attributes = True


# ===== Review Schemas =====
class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    destination_id: int


class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    destination_id: int
    created_at: str
    
    class Config:
        from_attributes = True


# ===== Travel Tip Schemas =====
class TravelTipBase(BaseModel):
    title: str
    content: str
    category: Optional[str] = None


class TravelTipCreate(TravelTipBase):
    pass


class TravelTipResponse(TravelTipBase):
    id: int
    user_id: int
    created_at: str
    
    class Config:
        from_attributes = True


# ===== Contact Message Schemas =====
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


class ContactMessageResponse(ContactMessageCreate):
    id: int
    created_at: str
    
    class Config:
        from_attributes = True


# ===== Token Schemas =====
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[int] = None
