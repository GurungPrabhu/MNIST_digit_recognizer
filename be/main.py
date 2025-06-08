import os
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.services.firebase_service import FirebaseService

app = FastAPI(title="MNIST Digit Prediction API")


load_dotenv()
allowed_origins = os.getenv("ALLOWED_ORIGINS", "")


origin_list = [
    origin.strip() for origin in allowed_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["content-type", "authorization"],
)

# Include prediction route
app.include_router(router, prefix="/api/v1", tags=["Predict"])


@app.get("/health-check")
def health_check():
    return {"message": "API is running successfully"}
