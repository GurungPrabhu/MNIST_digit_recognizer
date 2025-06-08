from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.firebase_service import get_firebase_service
from app.services.predict_service import predict_from_base64, preprocess_image

router = APIRouter()


class PredictRequest(BaseModel):
    image: str


class FeedbackRequest(BaseModel):
    image: str
    feedback: int


@router.post("/predict")
def predict_digit(request: PredictRequest):
    result = predict_from_base64(request.image)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/record-feedback")
def record_feedback(
    request: FeedbackRequest, firebase_service=Depends(get_firebase_service)
):
    image = preprocess_image(request.image)
    prediction = request.feedback

    # Record feedback in Firestore
    firebase_service.insert_document(
        collection_name="feedback", data={"image": str(image), "prediction": prediction}
    )

    return {"message": "Feedback recorded"}
