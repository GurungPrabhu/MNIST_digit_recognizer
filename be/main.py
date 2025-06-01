from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="MNIST Digit Prediction API")

# Optional: CORS if frontend is on a different domain or localhost port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include prediction route
app.include_router(router, prefix="/api/v1/predict", tags=["Predict"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the MNIST Digit Prediction API"}
