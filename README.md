# AgriAI — AI-Driven Smart Farming Marketplace & Advisory Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https.mit-license.org)
[![Deep Learning](https://img.shields.io/badge/Model-MobileNetV2-brightgreen.svg)](https://tensorflow.org)
[![Framework](https://img.shields.io/badge/Backend-Spring%20Boot%203-blue.svg)](https://spring.io)
[![AI Service](https://img.shields.io/badge/AI%20Service-FastAPI-teal.svg)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-cyan.svg)](https://react.dev)

**AgriAI** is a full-stack agricultural web application designed to empower smallholder farmers through **MobileNetV2 deep learning crop disease classification**, **RAG-augmented AI advisory grounded in research databases**, and a **direct farmer-to-buyer agricultural marketplace**.

---

## 📌 Problem Statement & Objectives

Modern agriculture faces two critical challenges:
1. **Crop Disease Identification & Advisory Delay**: Late diagnosis of foliar diseases (e.g. Early Blight, Late Blight, Bacterial Spot) leads to devastating crop losses. Generic LLM advice often hallucinates treatment chemicals.
2. **Marketplace Intermediary Exploitation**: Middlemen exploit price margins. Farmers lack direct channels to market produce to local commercial buyers.

### Objectives:
- Implement a **MobileNetV2 transfer learning model** for instant crop leaf disease recognition with confidence metrics.
- Build a **Retrieval-Augmented Generation (RAG)** pipeline utilizing **Chroma Cloud** vector database (`agricultural_knowledge`) and **Groq LLM** (`llama-3.3-70b-versatile`) to provide grounded, citation-backed advisories.
- Build a **Direct Farmer-to-Buyer Marketplace** with request approvals and direct pickup (strictly zero payments/logistics integration).

---

## 🏗️ System Architecture

```text
                 React 18 Frontend (Port 3000)
                       │
                       │ REST API (Port 8080)
                 Spring Boot 3 Backend
                       │
          ┌────────────┴────────────┐
          │                         │
      PostgreSQL                 FastAPI AI Service (Port 8000)
     (Neon Cloud)                   │
                        ┌───────────┴───────────┐
                        │                       │
                   MobileNetV2              RAG System
                    Engine                      │
                                           Chroma Cloud
                                                │
                                             Groq LLM
```

---

## 🧠 Core Technical Contribution: Deep Learning Model

The core technical contribution is the **Crop Disease Detection Model using MobileNetV2 Transfer Learning**.

### Dataset Strategy
- **PlantVillage**: Used exclusively for training, validation, and internal testing.
- **FieldPlant**: Kept strictly separate as an **independent external evaluation dataset** to measure real-field generalization under varied soil backgrounds and lighting conditions.

```text
PlantVillage Dataset ──> Model Training ──> Validation Split ──> Internal Test
                                                                     │
FieldPlant Dataset  ──> Independent Real-Field Evaluation ─────────┴──> Generalization Metrics
```

### Training Pipeline Summary
1. Images resized to `224x224` RGB and normalized using MobileNetV2 preprocessing (`preprocess_input`).
2. Applied data augmentation (random rotation, zoom, horizontal/vertical flips).
3. **Phase 1**: Base MobileNetV2 frozen, custom classification head trained with Adam optimizer (`lr=1e-3`).
4. **Phase 2**: Unfroze top layers of MobileNetV2, fine-tuned with lower learning rate (`lr=1e-5`) using EarlyStopping, ReduceLROnPlateau, and ModelCheckpoint callbacks.
5. Exported trained model to `models/plant_disease_mobilenetv2.keras` and dynamic class names to `models/class_names.json`.

---

## 🤖 RAG System & LLM Advisory

When a farmer scans a leaf or asks a question:
1. Query text is embedded using `sentence-transformers/all-MiniLM-L6-v2`.
2. High-dimensional similarity search is performed against **Chroma Cloud** vector collection `agricultural_knowledge` (database: `agriai`).
3. Retrieved knowledge documents (symptoms, causes, organic & chemical management, prevention, precautions) are passed as context to **Groq LLM** (`llama-3.3-70b-versatile`).
4. Generates structured advisory cards:
   - **What it means**
   - **Symptoms to identify**
   - **Management & Treatment**
   - **Preventive Practices**
   - **Precautions & Warnings**
   - **Verified Knowledge Sources** (ICAR, USDA Extension, FAO)

---

## 🛒 Direct Farmer-to-Buyer Marketplace Flow

The marketplace strictly implements direct farmer-to-buyer interaction with **no online payments or shipping APIs**:

```text
Farmer Lists Produce ──> Marketplace Catalog ──> Buyer Purchase Request (PENDING)
                                                              │
                                                     Farmer Accepts (ACCEPTED)
                                                              │
                                            Farmer Marks Ready for Pickup (READY_FOR_PICKUP)
                                                              │
                                           Buyer Views Location & Pickups Produce
                                                              │
                                                  Buyer Marks Order (COMPLETED)
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM v6
- **Main Backend**: Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, PostgreSQL (Neon Cloud / H2)
- **AI Microservice**: Python 3.13, FastAPI, Uvicorn, TensorFlow/Keras, Pydantic
- **Machine Learning**: MobileNetV2, Pillow, NumPy, Scikit-Learn, Matplotlib
- **RAG & Vector Search**: Chroma Cloud, SentenceTransformers (`all-MiniLM-L6-v2`), Groq LLM API

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env` in the respective component directories:

### FastAPI AI Service (`ai-service/.env`)
```env
GROQ_API_KEY=your_groq_api_key_here
CHROMA_API_KEY=your_chroma_cloud_key_here
CHROMA_TENANT=default_tenant
CHROMA_DATABASE=agriai
CHROMA_COLLECTION=agricultural_knowledge
```

### Spring Boot Backend (`backend/src/main/resources/application.yml` or OS ENV)
```env
DB_URL=jdbc:postgresql://your-neon-db.neon.tech/agriaidb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_password
JWT_SECRET=YourSuperSecure32ByteJwtSecretKeyHere
AI_SERVICE_URL=http://localhost:8000
```

### React Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🚀 Running the Application Locally

### 1. Train MobileNetV2 Model
```bash
cd ai-model
pip install -r requirements.txt
python training/train.py
python training/evaluate.py
```

### 2. Start FastAPI AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```

### 4. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🔑 Demo Accounts (Pre-configured on Startup)

| Role | Email | Password | Features |
|---|---|---|---|
| **Farmer** | `farmer@agriai.com` | `farmer123` | Crop Disease Upload, AI Advisory, Product Listing, Request Approvals |
| **Buyer** | `buyer@agriai.com` | `buyer123` | Marketplace Search, Send Purchase Requests, Pickup Confirmation |

---

## 🧪 Testing

- **Backend Unit Tests**: Run `mvn test` in `backend/`
- **FastAPI AI Tests**: Run `python ai-service/test_ai_service.py`
- **Model Evaluation**: Run `python ai-model/training/evaluate.py`

---

## 📄 Academic Viva & Presentation Guide

When presenting **AgriAI**:
1. **Core Contribution**: Highlight the **MobileNetV2 Transfer Learning Architecture** trained on PlantVillage and validated on independent FieldPlant images.
2. **RAG vs Generic LLM**: Explain that RAG eliminates hallucinated agricultural chemicals by fetching validated extension sources from Chroma Cloud before generating Groq LLM responses.
3. **Decoupled Microservice Pattern**: Point out that TensorFlow is isolated in FastAPI (`ai-service`), keeping the main Spring Boot transactional server lightweight and responsive.
