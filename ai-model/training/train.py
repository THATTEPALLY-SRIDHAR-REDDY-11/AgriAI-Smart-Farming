"""
Crop Disease Model Training Script using MobileNetV2 Transfer Learning
Trained on the official 38-class PlantVillage dataset.
Supports initial head training, fine-tuning, callback optimization, comprehensive metrics, and visualizations.
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras import layers, models, optimizers, callbacks
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support, ConfusionMatrixDisplay

try:
    from training.preprocessing import get_data_augmentation
except ImportError:
    from preprocessing import get_data_augmentation

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS_HEAD = 5
EPOCHS_FINE_TUNE = 5

class MetricsLogger(callbacks.Callback):
    """Callback to explicitly print Epoch, Training Loss, Accuracy, Val Loss, Val Accuracy, and LR."""
    def __init__(self, phase_name):
        super().__init__()
        self.phase_name = phase_name

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        lr = self.model.optimizer.learning_rate
        if callable(lr):
            lr = lr(self.model.optimizer.iterations)
        lr_val = float(lr.numpy()) if hasattr(lr, 'numpy') else float(lr)
        print(f"\n========================================================")
        print(f"[{self.phase_name}] Completed Epoch {epoch + 1}:")
        print(f" - Training Loss:        {logs.get('loss', 0):.4f}")
        print(f" - Training Accuracy:    {logs.get('accuracy', 0):.4f} ({logs.get('accuracy', 0)*100:.2f}%)")
        print(f" - Validation Loss:      {logs.get('val_loss', 0):.4f}")
        print(f" - Validation Accuracy:  {logs.get('val_accuracy', 0):.4f} ({logs.get('val_accuracy', 0)*100:.2f}%)")
        print(f" - Learning Rate:        {lr_val:.6e}")
        print(f"========================================================\n", flush=True)

def get_plantvillage_dataset_dirs(data_dir):
    """
    Validates presence of the real PlantVillage dataset with separate train and val directories.
    Raises FileNotFoundError if train or val directory is missing.
    """
    plantvillage_dir = os.path.join(data_dir, "PlantVillage")
    train_dir = os.path.join(plantvillage_dir, "train")
    val_dir = os.path.join(plantvillage_dir, "val")

    if not os.path.exists(train_dir):
        raise FileNotFoundError(f"[Dataset Error] Training directory not found at: {train_dir}")
    if not os.path.exists(val_dir):
        raise FileNotFoundError(f"[Dataset Error] Validation directory not found at: {val_dir}")

    train_classes = sorted([d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))])
    val_classes = sorted([d for d in os.listdir(val_dir) if os.path.isdir(os.path.join(val_dir, d))])

    if len(train_classes) < 2:
        raise FileNotFoundError(f"[Dataset Error] Fewer than 2 class directories found in {train_dir}")

    print(f"[Dataset] Verified real PlantVillage dataset:")
    print(f" - Train directory: {train_dir} ({len(train_classes)} classes)")
    print(f" - Val directory:   {val_dir} ({len(val_classes)} classes)")

    return train_dir, val_dir

def build_mobilenetv2_model(num_classes):
    """Builds MobileNetV2 transfer learning architecture as per specifications."""
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    # Freeze base model layers initially
    base_model.trainable = False

    inputs = layers.Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs, name="AgriAI_MobileNetV2")
    return model, base_model

def train():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(script_dir, ".."))
    data_dir = os.path.join(base_dir, "data")
    output_model_dir = os.path.join(base_dir, "models")
    os.makedirs(output_model_dir, exist_ok=True)

    train_dir, val_dir = get_plantvillage_dataset_dirs(data_dir)

    print("\n[Preprocessing] Loading dataset into TensorFlow pipelines...")
    raw_train_ds = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=True,
        seed=42,
        label_mode='categorical'
    )

    raw_val_ds = tf.keras.utils.image_dataset_from_directory(
        val_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False,
        label_mode='categorical'
    )

    class_names = raw_train_ds.class_names
    num_classes = len(class_names)
    print(f"[Preprocessing] Detected {num_classes} classes from train dataset.")

    # Save class names JSON dynamically
    class_names_path = os.path.join(output_model_dir, "class_names.json")
    with open(class_names_path, "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"[Model] Saved {num_classes} class names to {class_names_path}")

    # Connect Data Augmentation and MobileNetV2 preprocessing
    data_augmentation = get_data_augmentation()

    # Training pipeline: data augmentation ONLY for training + MobileNetV2 normalization
    train_ds = raw_train_ds.map(
        lambda x, y: (preprocess_input(data_augmentation(x, training=True)), y),
        num_parallel_calls=tf.data.AUTOTUNE
    ).prefetch(tf.data.AUTOTUNE)

    # Validation pipeline: MobileNetV2 normalization WITHOUT random augmentation
    val_ds = raw_val_ds.map(
        lambda x, y: (preprocess_input(x), y),
        num_parallel_calls=tf.data.AUTOTUNE
    ).prefetch(tf.data.AUTOTUNE)

    # Build model
    model, base_model = build_mobilenetv2_model(num_classes)
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("\n========================================================")
    print(" [Phase 1] Training Top Classification Head (Base MobileNetV2 Frozen)")
    print("========================================================")
    phase1_logger = MetricsLogger("Phase 1")
    history_head = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_HEAD,
        callbacks=[phase1_logger]
    )

    print("\n========================================================")
    print(" [Phase 2] Fine-Tuning MobileNetV2 (Unfreezing Upper Layers)")
    print("========================================================")
    base_model.trainable = True
    # Freeze lower layers up to layer 100
    for layer in base_model.layers[:100]:
        layer.trainable = False

    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    model_save_path = os.path.join(output_model_dir, "plant_disease_mobilenetv2.keras")
    callbacks_list = [
        MetricsLogger("Phase 2"),
        callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, verbose=1),
        callbacks.ModelCheckpoint(model_save_path, monitor='val_accuracy', save_best_only=True)
    ]

    history_fine = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_FINE_TUNE,
        callbacks=callbacks_list
    )

    # Ensure best checkpoint is loaded for evaluation and final save
    if os.path.exists(model_save_path):
        print(f"\n[Model] Loading best checkpoint model from: {model_save_path}")
        best_model = tf.keras.models.load_model(model_save_path)
    else:
        best_model = model
        best_model.save(model_save_path)

    # Plot Accuracy & Loss curves
    plot_training_curves(history_head, history_fine, output_model_dir)

    # Synchronize model and class names to ai-service/models
    ai_service_models_dir = os.path.abspath(os.path.join(base_dir, "..", "ai-service", "models"))
    os.makedirs(ai_service_models_dir, exist_ok=True)

    with open(os.path.join(ai_service_models_dir, "class_names.json"), "w") as f:
        json.dump(class_names, f, indent=2)

    best_model.save(os.path.join(ai_service_models_dir, "plant_disease_mobilenetv2.keras"))
    print(f"[Model] Synchronized model and class_names.json to FastAPI service at {ai_service_models_dir}")

    # Comprehensive Evaluation on the PlantVillage Validation Set
    evaluate_validation_metrics(best_model, val_ds, class_names, output_model_dir)

def evaluate_validation_metrics(model, val_ds, class_names, output_dir):
    print("\n========================================================")
    print(" FINAL EVALUATION ON PLANTVILLAGE VALIDATION SET ")
    print("========================================================")

    y_true = []
    y_pred = []

    print("[Evaluation] Computing predictions on validation dataset...", flush=True)
    for images, labels in val_ds:
        preds = model.predict(images, verbose=0)
        y_true.extend(np.argmax(labels.numpy(), axis=1))
        y_pred.extend(np.argmax(preds, axis=1))

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    acc = np.mean(y_true == y_pred)
    prec_w, rec_w, f1_w, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)
    prec_m, rec_m, f1_m, _ = precision_recall_fscore_support(y_true, y_pred, average='macro', zero_division=0)

    print("\n----------------- SUMMARY METRICS -----------------")
    print(f"Validation Accuracy:       {acc * 100:.2f}% ({acc:.4f})")
    print(f"Weighted Precision:        {prec_w * 100:.2f}% ({prec_w:.4f})")
    print(f"Weighted Recall:           {rec_w * 100:.2f}% ({rec_w:.4f})")
    print(f"Weighted F1-Score:         {f1_w * 100:.2f}% ({f1_w:.4f})")
    print(f"Macro Precision:           {prec_m * 100:.2f}% ({prec_m:.4f})")
    print(f"Macro Recall:              {rec_m * 100:.2f}% ({rec_m:.4f})")
    print(f"Macro F1-Score:            {f1_m * 100:.2f}% ({f1_m:.4f})")
    print("Multiclass Averaging Method:")
    print(" - 'Weighted': Weighted by number of true instances for each class (accounts for class support).")
    print(" - 'Macro': Unweighted mean across all classes (evaluates performance across all diseases equally).")
    print("---------------------------------------------------\n")

    print("Detailed Classification Report:")
    print(classification_report(y_true, y_pred, target_names=class_names, zero_division=0))

    # Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(20, 18))
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=[c.replace("___", "\n") for c in class_names])
    disp.plot(cmap='Blues', ax=ax, xticks_rotation=90, colorbar=False)
    plt.title('PlantVillage 38-Class Validation Confusion Matrix', fontsize=16)
    plt.tight_layout()
    cm_path = os.path.join(output_dir, "confusion_matrix.png")
    plt.savefig(cm_path, dpi=150)
    plt.close()
    print(f"[Visualization] Saved confusion matrix visualization to: {cm_path}")

def plot_training_curves(h_head, h_fine, output_dir):
    acc = h_head.history['accuracy'] + h_fine.history['accuracy']
    val_acc = h_head.history['val_accuracy'] + h_fine.history['val_accuracy']
    loss = h_head.history['loss'] + h_fine.history['loss']
    val_loss = h_head.history['val_loss'] + h_fine.history['val_loss']

    plt.figure(figsize=(14, 5))
    plt.subplot(1, 2, 1)
    plt.plot(acc, label='Training Accuracy', linewidth=2)
    plt.plot(val_acc, label='Validation Accuracy', linewidth=2)
    plt.axvline(x=len(h_head.history['accuracy'])-1, color='r', linestyle='--', label='Start Fine-Tuning')
    plt.title('MobileNetV2 Accuracy Curve')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.grid(True, alpha=0.3)
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(loss, label='Training Loss', linewidth=2)
    plt.plot(val_loss, label='Validation Loss', linewidth=2)
    plt.axvline(x=len(h_head.history['loss'])-1, color='r', linestyle='--', label='Start Fine-Tuning')
    plt.title('MobileNetV2 Loss Curve')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.grid(True, alpha=0.3)
    plt.legend()

    curve_path = os.path.join(output_dir, "training_curves.png")
    plt.tight_layout()
    plt.savefig(curve_path, dpi=150)
    plt.close()
    print(f"[Visualization] Saved training curves to {curve_path}")

if __name__ == '__main__':
    train()
