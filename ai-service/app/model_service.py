import os
import json
import numpy as np
from PIL import Image
import io

class ModelInterface:
    def predict(self, image_bytes: bytes) -> dict:
        raise NotImplementedError("Subclasses must implement predict method")

class RealMobileNetV2Model(ModelInterface):
    def __init__(self, model_path: str, class_names_path: str):
        import tensorflow as tf
        from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

        print(f"[ModelService] Loading real MobileNetV2 model from {model_path}...")
        self.tf = tf
        self.preprocess_input = preprocess_input
        self.model = tf.keras.models.load_model(model_path)
        with open(class_names_path, "r") as f:
            self.class_names = json.load(f)
        print(f"[ModelService] Loaded {len(self.class_names)} disease classes successfully.")

    def predict(self, image_bytes: bytes) -> dict:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        img_preprocessed = self.preprocess_input(img_array)

        predictions = self.model.predict(img_preprocessed, verbose=0)[0]
        top_idx = int(np.argmax(predictions))
        confidence = float(predictions[top_idx])
        raw_label = self.class_names[top_idx]

        # Parse crop and disease from label format (e.g. "Tomato___Early_blight")
        if "___" in raw_label:
            crop, disease_name = raw_label.split("___", 1)
            crop = crop.replace("_", " ").strip()
            disease = f"{crop} {disease_name.replace('_', ' ').strip()}"
        else:
            crop = "Tomato"
            disease = raw_label.replace("_", " ")

        return {
            "crop": crop,
            "disease": disease,
            "confidence": round(confidence, 4),
            "is_mock": False
        }

class MockModel(ModelInterface):
    def __init__(self):
        print("[ModelService] Initializing MockModel fallback service (Development Mode).")
        self.classes = [
            {"crop": "Tomato", "disease": "Tomato Early Blight", "confidence": 0.94},
            {"crop": "Tomato", "disease": "Tomato Late Blight", "confidence": 0.91},
            {"crop": "Potato", "disease": "Potato Early Blight", "confidence": 0.89},
            {"crop": "Potato", "disease": "Potato Late Blight", "confidence": 0.95},
            {"crop": "Corn", "disease": "Corn Common Rust", "confidence": 0.92},
            {"crop": "Pepper", "disease": "Pepper Bacterial Spot", "confidence": 0.88},
            {"crop": "Tomato", "disease": "Tomato Healthy", "confidence": 0.98}
        ]

    def predict(self, image_bytes: bytes) -> dict:
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            # Select prediction based on image hash/dimensions for deterministic test behavior
            img_hash = sum(img.size) + len(image_bytes)
            idx = img_hash % len(self.classes)
        except Exception:
            idx = 0

        res = self.classes[idx].copy()
        res["is_mock"] = True
        return res

def get_model_service() -> ModelInterface:
    app_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(app_dir, ".."))
    model_path = os.path.join(base_dir, "models", "plant_disease_mobilenetv2.keras")
    class_names_path = os.path.join(base_dir, "models", "class_names.json")

    if not os.path.exists(model_path):
        raise RuntimeError(f"MobileNetV2 model file not found: {model_path}")
    if not os.path.exists(class_names_path):
        raise RuntimeError(f"MobileNetV2 class names file not found: {class_names_path}")

    try:
        return RealMobileNetV2Model(model_path, class_names_path)
    except Exception as e:
        raise RuntimeError(f"Failed to load the real MobileNetV2 model: {e}") from e
