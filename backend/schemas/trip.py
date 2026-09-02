from pydantic import BaseModel


class Trip(BaseModel):
    country: str
    predicted_price: float
    highest_point: int
    total_slope: int
    gondola_lifts: int
    lift_capacity: int
    snowparks: str
    night_ski: str
    notes: str | None = None


class TripResponse(Trip):
    id: int

    class Config:
        from_attributes = True