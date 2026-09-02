from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import joblib
from pathlib import Path

router = APIRouter()

MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "ml"
    / "models"
    / "ski_pass_price_model.pkl"
)

model = joblib.load(MODEL_PATH)


class SkiResortInput(BaseModel):
    Country: str
    HighestPoint: int
    LowestPoint: int
    BeginnerSlope: int
    IntermediateSlope: int
    DifficultSlope: int
    TotalSlope: int
    Snowparks: str
    NightSki: str
    SurfaceLifts: int
    ChairLifts: int
    GondolaLifts: int
    TotalLifts: int
    LiftCapacity: int
    SnowCannons: int


@router.post("/predict")
def predict_ski_pass(data: SkiResortInput):
    input_df = pd.DataFrame([data.model_dump()])

    prediction = model.predict(input_df)[0]

    return {
        "predicted_day_pass_price": round(float(prediction), 2)
    }