# AgriAI — Architecture & Technical Flow Diagrams

## 1. Full-Stack System Architecture

```mermaid
flowchart TD
    User["Farmer / Buyer Browser"] --> Frontend["React 18 + Vite + Tailwind CSS"]
    Frontend -->|HTTP / REST API| Backend["Spring Boot 3 Backend Server"]
    Backend -->|Spring Data JPA| DB[("Neon PostgreSQL Cloud DB")]
    Backend -->|HTTP / JSON| FastAPI["FastAPI AI Microservice"]
    
    subgraph FastAPI_AIService["FastAPI AI Microservice (Port 8000)"]
        FastAPI --> ModelEngine["MobileNetV2 Deep Learning Engine"]
        FastAPI --> RAGEngine["Retrieval-Augmented Generation (RAG)"]
        ModelEngine -->|Inference| Weights["plant_disease_mobilenetv2.keras"]
        RAGEngine -->|Dense Vector Embedding| SentenceTransformers["sentence-transformers/all-MiniLM-L6-v2"]
        SentenceTransformers -->|Vector Similarity Search| ChromaCloud[("Chroma Cloud Database: agriai")]
        RAGEngine -->|Context + Query| GroqLLM["Groq Llama-3 LLM API"]
    end
```

## 2. Crop Disease Classification & RAG Advisory Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    participant React as React Frontend
    participant Spring as Spring Boot Backend
    participant FastAPI as FastAPI AI Service
    participant DL as MobileNetV2 Model
    participant Vector as Chroma Cloud DB
    participant LLM as Groq LLM API

    Farmer->>React: Upload Leaf Image
    React->>Spring: POST /api/disease/predict/{farmerId}
    Spring->>FastAPI: POST /predict (Multipart Image)
    FastAPI->>DL: Preprocess (224x224 RGB) & Predict
    DL-->>FastAPI: {disease: "Tomato Early Blight", confidence: 0.94}
    FastAPI-->>Spring: JSON Prediction Result
    Spring-->>React: Saved Prediction History & Result

    Farmer->>React: Click "Get AI Grounded Advisory"
    React->>Spring: POST /api/advisory/farmer/{farmerId}
    Spring->>FastAPI: POST /advisory
    FastAPI->>Vector: Search Query Embedding in collection 'agricultural_knowledge'
    Vector-->>FastAPI: Top-3 Relevant Agricultural Knowledge Documents
    FastAPI->>LLM: Pass Retrieved Knowledge Context + Question
    LLM-->>FastAPI: Grounded Advisory Response
    FastAPI-->>Spring: Structured Advisory (Symptoms, Management, Prevention, Sources)
    Spring-->>React: Render AI Advisory Cards
```

## 3. Direct Farmer-to-Buyer Marketplace Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    actor Buyer
    participant Market as Marketplace Platform

    Farmer->>Market: List Agricultural Produce (Name, Price, Qty, Pickup Location)
    Buyer->>Market: Search & Filter Available Produce
    Buyer->>Market: Submit Purchase Request (Requested Qty, Message) [PENDING]
    Market-->>Farmer: Notify New Purchase Request
    Farmer->>Market: Accept Purchase Request [ACCEPTED]
    Farmer->>Market: Mark Produce Ready for Pickup [READY_FOR_PICKUP]
    Market-->>Buyer: Show Farmer Phone Contact & Exact Farm Pickup Location
    Buyer->>Farmer: Direct Physical Pickup at Farm
    Buyer->>Market: Confirm & Mark Purchase Completed [COMPLETED]
```
