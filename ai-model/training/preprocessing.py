"""
Data Preprocessing Module for Crop Disease Classification using MobileNetV2
Supports PlantVillage dataset preprocessing, normalization, and data augmentation.
"""

import os
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

def get_data_augmentation():
    """
    Returns data augmentation pipeline for robust training.
    """
    return tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal_and_vertical"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomContrast(0.1),
    ], name="data_augmentation")

def preprocess_image(image, label):
    """
    Preprocess image for MobileNetV2 (expects 224x224 RGB with values normalized [-1, 1]).
    """
    image = tf.image.resize(image, IMG_SIZE)
    image = preprocess_input(image)
    return image, label

def load_dataset(data_dir, img_size=IMG_SIZE, batch_size=BATCH_SIZE, validation_split=0.2):
    """
    Loads dataset from directory using image_dataset_from_directory,
    applies splits, preprocessing and augmentation.
    """
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=validation_split,
        subset="training",
        seed=123,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='categorical'
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=validation_split,
        subset="validation",
        seed=123,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='categorical'
    )

    class_names = train_ds.class_names

    # Configure dataset performance
    train_ds = train_ds.map(preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)
    val_ds = val_ds.map(preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)

    train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    return train_ds, val_ds, class_names
