"""
External Evaluation Module for MobileNetV2 Crop Disease Classifier
Evaluates existing trained MobileNetV2 model on independent PlantDoc dataset (Parquet format).
"""

import os
import io
import json
import numpy as np
import pandas as pd
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support
import matplotlib.pyplot as plt

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# Reliable Mapping from PlantDoc dataset labels to 38 PlantVillage MobileNetV2 class names
PLANTDOC_TO_PLANTVILLAGE = {
    'Apple Scab Leaf': 'Apple___Apple_scab',
    'Apple leaf': 'Apple___healthy',
    'Apple rust leaf': 'Apple___Cedar_apple_rust',
    'Bell_pepper leaf': 'Pepper,_bell___healthy',
    'Bell_pepper leaf spot': 'Pepper,_bell___Bacterial_spot',
    'Blueberry leaf': 'Blueberry___healthy',
    'Cherry leaf': 'Cherry_(including_sour)___healthy',
    'Corn Gray leaf spot': 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn leaf blight': 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn rust leaf': 'Corn_(maize)___Common_rust_',
    'Peach leaf': 'Peach___healthy',
    'Potato leaf early blight': 'Potato___Early_blight',
    'Potato leaf late blight': 'Potato___Late_blight',
    'Raspberry leaf': 'Raspberry___healthy',
    'Soyabean leaf': 'Soybean___healthy',
    'Squash Powdery mildew leaf': 'Squash___Powdery_mildew',
    'Strawberry leaf': 'Strawberry___healthy',
    'Tomato Early blight leaf': 'Tomato___Early_blight',
    'Tomato Septoria leaf spot': 'Tomato___Septoria_leaf_spot',
    'Tomato leaf': 'Tomato___healthy',
    'Tomato leaf bacterial spot': 'Tomato___Bacterial_spot',
    'Tomato leaf late blight': 'Tomato___Late_blight',
    'Tomato leaf mosaic virus': 'Tomato___Tomato_mosaic_virus',
    'Tomato leaf yellow virus': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato mold leaf': 'Tomato___Leaf_Mold',
    'Tomato two spotted spider mites leaf': 'Tomato___Spider_mites Two-spotted_spider_mite',
    'grape leaf': 'Grape___healthy',
    'grape leaf black rot': 'Grape___Black_rot'
}

def evaluate_plantdoc():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(script_dir, ".."))
    model_path = os.path.join(base_dir, "models", "plant_disease_mobilenetv2.keras")
    class_names_path = os.path.join(base_dir, "models", "class_names.json")
    plantdoc_dir = os.path.join(base_dir, "data", "PlantDoc")
    
    pf1 = os.path.join(plantdoc_dir, "train-00000-of-00002.parquet")
    pf2 = os.path.join(plantdoc_dir, "train-00001-of-00002.parquet")

    # Validate file existence
    if not os.path.exists(model_path) or not os.path.exists(class_names_path):
        raise FileNotFoundError(f"[Error] Model ({model_path}) or class_names.json ({class_names_path}) not found!")

    if not os.path.exists(pf1) or not os.path.exists(pf2):
        raise FileNotFoundError(f"[Error] PlantDoc parquet files not found in {plantdoc_dir}!")

    # 1. Load model and class names
    with open(class_names_path, "r") as f:
        class_names = json.load(f)

    print(f"[Loading Model] {model_path}")
    model = tf.keras.models.load_model(model_path)

    # 2. Read and combine Parquet files
    df1 = pd.read_parquet(pf1)
    df2 = pd.read_parquet(pf2)
    df = pd.concat([df1, df2], ignore_index=True)

    # 3. Filter only rows where split == 'test'
    test_df = df[df['split'] == 'test'].copy().reset_index(drop=True)
    num_test_images = len(test_df)
    mapped_classes_in_test = test_df['class_label'].nunique()

    # Pre-evaluation output requirements
    print("\n========================================================")
    print("         EXTERNAL EVALUATION — PLANTDOC                 ")
    print("========================================================")
    print(f"Dataset: PlantDoc")
    print(f"Split: test")
    print(f"Number of images: {num_test_images}")
    print(f"Number of mapped classes: {mapped_classes_in_test}")
    print("\nClass Mapping Being Used:")
    for pd_cls, pv_cls in PLANTDOC_TO_PLANTVILLAGE.items():
        print(f"  '{pd_cls}' -> '{pv_cls}'")
    print("--------------------------------------------------------\n")

    images_list = []
    targets_list = []
    successful_images = 0
    failed_images = 0

    # 4 & 5 & 6. Decode, resize, and apply MobileNetV2 preprocess_input
    for idx, row in test_df.iterrows():
        try:
            pd_label = row['class_label']
            pv_label = PLANTDOC_TO_PLANTVILLAGE.get(pd_label)
            
            if pv_label not in class_names:
                print(f"[Warning] Row {idx}: Mapped class '{pv_label}' not found in model class_names.json")
                failed_images += 1
                continue

            target_idx = class_names.index(pv_label)
            
            img_field = row['image']
            if isinstance(img_field, dict):
                img_bytes = img_field.get('bytes')
            else:
                img_bytes = img_field

            if not img_bytes:
                failed_images += 1
                continue

            pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            pil_img = pil_img.resize(IMG_SIZE)
            img_arr = np.array(pil_img, dtype=np.float32)

            # MobileNetV2 preprocess_input
            img_preprocessed = preprocess_input(img_arr)

            images_list.append(img_preprocessed)
            targets_list.append(target_idx)
            successful_images += 1

        except Exception as e:
            print(f"[Error] Failed to process image row {idx}: {e}")
            failed_images += 1

    if successful_images == 0:
        raise ValueError("[Error] No valid images were processed for evaluation!")

    X_test = np.array(images_list, dtype=np.float32)
    y_true = np.array(targets_list, dtype=int)

    # 9. Generate predictions
    print(f"[Inference] Generating predictions for {successful_images} images...")
    preds = model.predict(X_test, batch_size=BATCH_SIZE, verbose=1)
    y_pred = np.argmax(preds, axis=1)

    # 10. Calculate metrics
    accuracy = float(np.mean(y_true == y_pred))

    w_prec, w_rec, w_f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)
    m_prec, m_rec, m_f1, _ = precision_recall_fscore_support(y_true, y_pred, average='macro', zero_division=0)

    # Present labels for active classes
    active_labels = sorted(list(set(y_true) | set(y_pred)))
    active_target_names = [class_names[i] for i in active_labels]

    # 11. Classification report
    clf_report_str = classification_report(y_true, y_pred, labels=active_labels, target_names=active_target_names, zero_division=0)
    clf_report_dict = classification_report(y_true, y_pred, labels=active_labels, target_names=active_target_names, zero_division=0, output_dict=True)

    print("\n========================================================")
    print("      EXTERNAL EVALUATION — PLANTDOC RESULTS            ")
    print("========================================================")
    print(f"Successfully Processed Images: {successful_images}")
    print(f"Failed/Invalid Images:         {failed_images}")
    print(f"Accuracy:            {accuracy * 100:.2f}%")
    print(f"Weighted Precision:  {w_prec * 100:.2f}%")
    print(f"Weighted Recall:     {w_rec * 100:.2f}%")
    print(f"Weighted F1-Score:   {w_f1 * 100:.2f}%")
    print(f"Macro Precision:     {m_prec * 100:.2f}%")
    print(f"Macro Recall:        {m_rec * 100:.2f}%")
    print(f"Macro F1-Score:      {m_f1 * 100:.2f}%")

    print("\nDetailed Classification Report:")
    print(clf_report_str)

    # 12. Generate and save PlantDoc confusion matrix plot
    cm = confusion_matrix(y_true, y_pred, labels=active_labels)
    cm_path = os.path.join(base_dir, "models", "plantdoc_confusion_matrix.png")

    plt.figure(figsize=(14, 12))
    plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title('External Evaluation — PlantDoc Confusion Matrix', fontsize=14, pad=15)
    plt.colorbar()

    tick_marks = np.arange(len(active_target_names))
    plt.xticks(tick_marks, active_target_names, rotation=90, fontsize=8)
    plt.yticks(tick_marks, active_target_names, fontsize=8)
    plt.xlabel('Predicted Label', fontsize=11)
    plt.ylabel('True Label', fontsize=11)

    # Annotate matrix values
    thresh = cm.max() / 2. if cm.max() > 0 else 1.
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            val = cm[i, j]
            if val > 0:
                plt.text(j, i, format(val, 'd'),
                         horizontalalignment="center",
                         color="white" if val > thresh else "black",
                         fontsize=7)

    plt.tight_layout()
    plt.savefig(cm_path, dpi=300)
    plt.close()
    print(f"[Saved] Confusion Matrix plot saved to: {cm_path}")

    # 13. Save evaluation results JSON file
    results_path = os.path.join(base_dir, "models", "plantdoc_evaluation_results.json")
    results_data = {
        "evaluation_title": "External Evaluation — PlantDoc",
        "dataset": "PlantDoc",
        "split": "test",
        "total_test_images": num_test_images,
        "successfully_processed_images": successful_images,
        "failed_images": failed_images,
        "number_of_mapped_classes": mapped_classes_in_test,
        "overall_metrics": {
            "accuracy": float(accuracy),
            "weighted_precision": float(w_prec),
            "weighted_recall": float(w_rec),
            "weighted_f1_score": float(w_f1),
            "macro_precision": float(m_prec),
            "macro_recall": float(m_rec),
            "macro_f1_score": float(m_f1)
        },
        "per_class_results": clf_report_dict
    }

    with open(results_path, "w") as f:
        json.dump(results_data, f, indent=2)
    print(f"[Saved] Evaluation results JSON saved to: {results_path}")

if __name__ == '__main__':
    evaluate_plantdoc()

