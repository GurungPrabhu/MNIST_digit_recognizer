from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.predict_service import predict_from_base64

router = APIRouter()


class PredictRequest(BaseModel):
    image: str


@router.post("/")
def predict_digit(request: PredictRequest):
    result = predict_from_base64(request.image)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
