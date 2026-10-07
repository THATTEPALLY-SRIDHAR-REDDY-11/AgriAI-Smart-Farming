# AgriAI — FastAPI AI Service

FastAPI service for **MobileNetV2 Disease Prediction** and **RAG Agricultural Advisory**.

## Endpoints

- `GET /health`: Returns service health status and model load state.
- `POST /predict`: Accepts leaf image (`multipart/form-data`) and returns disease classification & confidence score.
- `POST /advisory`: Accepts JSON payload (`question`, `crop`, `disease`) and returns grounded RAG advisory generated using Groq LLM & Chroma Cloud vector search.
- `POST /rag/ingest`: Accepts structured knowledge documents to ingest into Chroma vector collection (`agriai`).

## Quickstart

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
