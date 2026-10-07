import requests
import json
import os

BASE_URL = "http://localhost:8085/api"
FASTAPI_URL = "http://127.0.0.1:8000"

def test_full_flow():
    print("--- 1. Testing FastAPI AI Service Health ---")
    resp = requests.get(f"{FASTAPI_URL}/health")
    print("FastAPI Health Status Code:", resp.status_code)
    print("FastAPI Health Response:", resp.json())
    assert resp.status_code == 200
    assert resp.json().get("model_loaded") == True

    print("\n--- 2. Testing Spring Boot Auth Login ---")
    login_payload = {
        "email": "farmer@agriai.com",
        "password": "farmer123"
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    print("Login Status Code:", resp.status_code)
    auth_data = resp.json()
    print("Login Response:", json.dumps(auth_data, indent=2))
    assert resp.status_code == 200
    token = auth_data["token"]
    farmer_id = auth_data["profileId"]
    headers = {"Authorization": f"Bearer {token}"}

    print("\n--- 3. Testing Disease Prediction Flow (Spring Boot -> FastAPI -> MobileNetV2 -> Neon DB) ---")
    image_path = os.path.abspath("ai-model/data/PlantVillage/val/Tomato___Early_blight/0034a551-9512-44e5-ba6c-827f85ecc688___RS_Erly.B 9432.JPG")
    assert os.path.exists(image_path), f"Test leaf image not found at {image_path}"
    
    with open(image_path, "rb") as f:
        files = {"image": ("test_leaf.jpg", f, "image/jpeg")}
        resp = requests.post(f"{BASE_URL}/disease/predict/{farmer_id}", headers=headers, files=files)

    print("Prediction Status Code:", resp.status_code)
    pred_data = resp.json()
    print("Prediction Response:", json.dumps(pred_data, indent=2))
    assert resp.status_code == 200
    assert pred_data.get("crop") is not None
    assert pred_data.get("disease") is not None

    print("\n--- 4. Verifying DiseasePrediction History in Neon DB ---")
    resp = requests.get(f"{BASE_URL}/disease/history/{farmer_id}", headers=headers)
    print("Prediction History Status Code:", resp.status_code)
    history = resp.json()
    print("Prediction History Length:", len(history))
    print("Latest History Item:", json.dumps(history[0] if history else {}, indent=2))
    assert resp.status_code == 200
    assert len(history) > 0

    print("\n--- 5. Testing AI Advisory Flow (Spring Boot -> FastAPI -> RAG Chroma Cloud -> Groq LLM -> Neon DB) ---")
    advisory_payload = {
        "question": "How should I manage tomato early blight?",
        "crop": pred_data.get("crop", "Tomato"),
        "disease": pred_data.get("disease", "Tomato Early Blight"),
        "confidence": pred_data.get("confidence", 0.95)
    }
    resp = requests.post(f"{BASE_URL}/advisory/farmer/{farmer_id}", headers=headers, json=advisory_payload)
    print("Advisory Status Code:", resp.status_code)
    adv_data = resp.json()
    print("Advisory Response:", json.dumps(adv_data, indent=2))
    assert resp.status_code == 200

    print("\n--- 6. Verifying AdvisoryHistory in Neon DB ---")
    resp = requests.get(f"{BASE_URL}/advisory/history/{farmer_id}", headers=headers)
    print("Advisory History Status Code:", resp.status_code)
    adv_history = resp.json()
    print("Advisory History Length:", len(adv_history))
    print("Latest Advisory History Item:", json.dumps(adv_history[0] if adv_history else {}, indent=2))
    assert resp.status_code == 200
    assert len(adv_history) > 0

    print("\n=== ALL END-TO-END AI INTEGRATION TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_full_flow()
