import io
import unittest
from fastapi.testclient import TestClient
from app.main import app
from PIL import Image

class TestAIService(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")

    def test_predict_endpoint(self):
        # Create a test leaf image in memory
        img = Image.new("RGB", (224, 224), color=(34, 139, 34))
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)

        response = self.client.post(
            "/predict",
            files={"image": ("test_leaf.jpg", img_byte_arr, "image/jpeg")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("disease", data)
        self.assertIn("crop", data)
        self.assertIn("confidence", data)

    def test_advisory_endpoint(self):
        payload = {
            "question": "How should I manage tomato early blight?",
            "crop": "Tomato",
            "disease": "Tomato Early Blight",
            "confidence": 0.94
        }
        response = self.client.post("/advisory", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("symptoms", data)
        self.assertIn("management", data)
        self.assertIn("prevention", data)
        self.assertIn("sources", data)

if __name__ == "__main__":
    unittest.main()
