from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PredictionResponse(BaseModel):
    crop: str = Field(..., example="Tomato")
    disease: str = Field(..., example="Tomato Early Blight")
    confidence: float = Field(..., example=0.94)
    is_mock: bool = Field(default=False, example=False)
    status: str = Field(default="success")

class AdvisoryRequest(BaseModel):
    question: Optional[str] = Field(None, example="How should I manage tomato early blight?")
    crop: Optional[str] = Field(None, example="Tomato")
    disease: Optional[str] = Field(None, example="Tomato Early Blight")
    confidence: Optional[float] = Field(None, example=0.94)

class AdvisoryResponse(BaseModel):
    crop: str
    disease: str
    confidence: Optional[float] = None
    what_it_means: str
    symptoms: List[str]
    management: List[str]
    prevention: List[str]
    precautions: str
    sources: List[str]
    answer: str

class IngestRequest(BaseModel):
    documents: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "AgriAI FastAPI AI Service"
    model_loaded: bool
