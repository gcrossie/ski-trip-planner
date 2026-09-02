from sqlalchemy import Column, Integer, String
from database import Base

class TripModel(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    date = Column(String, nullable=False)
    status = Column(String, nullable=False)
    notes = Column(String, nullable=False)