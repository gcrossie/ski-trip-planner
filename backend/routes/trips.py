from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.trip import TripModel
from schemas.trip import Trip, TripResponse

router = APIRouter()

# Databas-connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET all trips
@router.get("/trips", response_model=list[TripResponse])
def get_trips(db: Session = Depends(get_db)):
    return db.query(TripModel).all()


# GET one trip
@router.get("/trips/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    return trip


# CREATE trip
@router.post("/trips", response_model=TripResponse, status_code=201)
def create_trip(trip: Trip, db: Session = Depends(get_db)):
    new_trip = TripModel(
        title=trip.title,
        category=trip.category,
        date=trip.date,
        status=trip.status,
        notes=trip.notes
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


# UPDATE trip
@router.put("/trips/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: int, updated_trip: Trip, db: Session = Depends(get_db)):
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.title = updated_trip.title
    trip.category = updated_trip.category
    trip.date = updated_trip.date
    trip.status = updated_trip.status
    trip.notes = updated_trip.notes

    db.commit()
    db.refresh(trip)

    return trip


# DELETE trip
@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    db.delete(trip)
    db.commit()

    return {"message": "Trip deleted"}