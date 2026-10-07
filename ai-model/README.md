# AgriAI — AI Model Module: MobileNetV2 Crop Disease Classifier

This directory contains the deep learning core contribution for **AgriAI**:
- Preprocessing and augmentation pipelines (`training/preprocessing.py`)
- MobileNetV2 transfer learning model training script (`training/train.py`)
- Independent FieldPlant evaluation script (`training/evaluate.py`)
- Interactive Jupyter notebook (`notebooks/plant_village_mobilenetv2_training.ipynb`)

## Pipeline Overview

1. **Dataset**: PlantVillage (training, validation, internal test).
2. **External Evaluation**: FieldPlant (independent real-field testing).
3. **Architecture**: MobileNetV2 with ImageNet pretrained weights.
4. **Exported Artifacts**: `models/plant_disease_mobilenetv2.keras` and `models/class_names.json`.

## How to Run

```bash
pip install -r requirements.txt
python training/train.py
python training/evaluate.py
```
