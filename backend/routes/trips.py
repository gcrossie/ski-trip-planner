from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.trip import TripModel
from schemas.trip import Trip, TripResponse

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/trips", response_model=list[TripResponse])
def get_trips(db: Session = Depends(get_db)):
    return db.query(TripModel).all()


@router.get("/trips/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    return trip


@router.post("/trips", response_model=TripResponse, status_code=201)
def create_trip(trip: Trip, db: Session = Depends(get_db)):
    new_trip = TripModel(
        country=trip.country,
        predicted_price=trip.predicted_price,
        highest_point=trip.highest_point,
        total_slope=trip.total_slope,
        gondola_lifts=trip.gondola_lifts,
        lift_capacity=trip.lift_capacity,
        snowparks=trip.snowparks,
        night_ski=trip.night_ski,
        notes=trip.notes,
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


@router.put("/trips/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    updated_trip: Trip,
    db: Session = Depends(get_db),
):
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.country = updated_trip.country
    trip.predicted_price = updated_trip.predicted_price
    trip.highest_point = updated_trip.highest_point
    trip.total_slope = updated_trip.total_slope
    trip.gondola_lifts = updated_trip.gondola_lifts
    trip.lift_capacity = updated_trip.lift_capacity
    trip.snowparks = updated_trip.snowparks
    trip.night_ski = updated_trip.night_ski
    trip.notes = updated_trip.notes

    db.commit()
    db.refresh(trip)

    return trip


@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    db.delete(trip)
    db.commit()

    return {"message": "Trip deleted"}