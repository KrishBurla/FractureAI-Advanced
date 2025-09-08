import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# --- Configuration ---
IMAGE_SIZE = 150 # Resize images to 150x150
BATCH_SIZE = 32
EPOCHS = 15 # Number of times the model sees the entire dataset
DATASET_PATH = 'dataset'

# --- Data Loading and Preprocessing ---
print("Loading and preprocessing data...")
images = []
labels = []
class_names = sorted(os.listdir(DATASET_PATH))
class_map = {name: i for i, name in enumerate(class_names)}

for class_name in class_names:
    class_path = os.path.join(DATASET_PATH, class_name)
    if not os.path.isdir(class_path):
        continue
    for img_name in os.listdir(class_path):
        try:
            img_path = os.path.join(class_path, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE) # Load as grayscale
            if img is None:
                print(f"Warning: Could not read image {img_path}")
                continue
            img = cv2.resize(img, (IMAGE_SIZE, IMAGE_SIZE))
            images.append(img)
            labels.append(class_map[class_name])
        except Exception as e:
            print(f"Error processing image {img_path}: {e}")

# Convert to numpy arrays and normalize
images = np.array(images).reshape(-1, IMAGE_SIZE, IMAGE_SIZE, 1) / 255.0
labels = np.array(labels)
labels = to_categorical(labels, num_classes=len(class_names))

# Split data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(images, labels, test_size=0.2, random_state=42)

print(f"Data loaded: {len(X_train)} training samples, {len(X_val)} validation samples.")

# --- NEW: Data Augmentation ---
print("Creating data augmentation generator...")
datagen = ImageDataGenerator(
    rotation_range=15,      # Randomly rotate images by up to 15 degrees
    width_shift_range=0.1,  # Randomly shift images horizontally
    height_shift_range=0.1, # Randomly shift images vertically
    shear_range=0.1,        # Apply shear transformations
    zoom_range=0.1,         # Randomly zoom in on images
    horizontal_flip=True,   # Randomly flip images horizontally
    fill_mode='nearest'     # Fill in new pixels created by transformations
)

datagen.fit(X_train)
# --- END NEW SECTION ---

# --- CNN Model Architecture ---
print("Building the CNN model...")
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(IMAGE_SIZE, IMAGE_SIZE, 1)),
    MaxPooling2D((2, 2)),

    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),

    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),

    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5), # Dropout for regularization
    Dense(len(class_names), activation='softmax') # Output layer
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

model.summary()

print("Starting model training with data augmentation...")

# We use datagen.flow() to feed augmented images in batches
history = model.fit(
    datagen.flow(X_train, y_train, batch_size=BATCH_SIZE),
    steps_per_epoch=len(X_train) // BATCH_SIZE,
    epochs=EPOCHS,
    validation_data=(X_val, y_val)
)

# --- Save the Model ---
model.save('fracture_model.h5')
print("Training complete. Model saved as 'fracture_model.h5'")