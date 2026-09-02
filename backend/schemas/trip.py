from enum import Enum
from pydantic import BaseModel


class CategoryEnum(str, Enum):
    flight = "flight"
    hotel = "hotel"
    activity = "activity"
    restaurant = "restaurant"
    hidden_gem = "hidden_gem"


class StatusEnum(str, Enum):
    planned = "planned"
    booked = "booked"
    completed = "completed"


class Trip(BaseModel):
    title: str
    category: CategoryEnum
    date: str
    status: StatusEnum
    notes: str


class TripResponse(Trip):
    id: int

    class Config:
        from_attributes = True