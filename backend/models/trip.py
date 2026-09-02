from sqlalchemy import Column, Integer, String, Float
from database import Base


class TripModel(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    country = Column(String, nullable=False)
    predicted_price = Column(Float, nullable=False)

    highest_point = Column(Integer, nullable=False)
    total_slope = Column(Integer, nullable=False)
    gondola_lifts = Column(Integer, nullable=False)
    lift_capacity = Column(Integer, nullable=False)

    snowparks = Column(String, nullable=False)
    night_ski = Column(String, nullable=False)

    notes = Column(String, nullable=True)