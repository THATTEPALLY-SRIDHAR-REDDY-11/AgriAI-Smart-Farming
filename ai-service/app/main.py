from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional

from app.schemas import PredictionResponse, AdvisoryRequest, AdvisoryResponse, IngestRequest, HealthResponse
from app.model_service import get_model_service, RealMobileNetV2Model
from app.rag_service import rag_service

app = FastAPI(
    title="AgriAI FastAPI AI Service",
    description="Deep Learning Crop Disease Detection (MobileNetV2) & RAG Advisory Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_service = get_model_service()

@app.get("/health", response_model=HealthResponse)
def health_check():
    is_real = isinstance(model_service, RealMobileNetV2Model)
    return HealthResponse(
        status="ok",
        service="AgriAI FastAPI AI Service",
        model_loaded=is_real
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_crop_disease(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG/PNG).")

    try:
        contents = await image.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded image is empty.")

        prediction = model_service.predict(contents)
        return PredictionResponse(**prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image prediction failed: {str(e)}")

@app.post("/advisory", response_model=AdvisoryResponse)
def get_advisory(payload: AdvisoryRequest):
    try:
        advisory_data = rag_service.generate_advisory(
            question=payload.question,
            crop=payload.crop,
            disease=payload.disease,
            confidence=payload.confidence
        )
        return AdvisoryResponse(**advisory_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advisory generation failed: {str(e)}")

@app.post("/rag/ingest")
def ingest_knowledge(payload: IngestRequest):
    try:
        count = rag_service.ingest_documents(payload.documents)
        return {"status": "success", "ingested_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
    )
