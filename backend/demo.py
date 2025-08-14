import tensorflow as tf
import numpy as np
import cv2
import sys
import os
import json

# --- Configuration for Your Project ---
MODEL_PATH = 'fracture_model.h5'
IMAGE_SIZE = (224, 224)
# These are the class names your model was trained on.
CLASS_NAMES = ['simple_fracture', 'not_fractured', 'communited_fracture'] 

def preprocess_image(image_path):
    """
    Loads and preprocesses an image exactly as your web app does.
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            print(f"Error: Could not read image from path: {image_path}")
            return None
        
        img_resized = cv2.resize(img, IMAGE_SIZE)
        img_array = np.asarray(img_resized)
        img_array = img_array / 255.0 # Normalize pixel values
        
        return np.expand_dims(img_array, axis=0) # Add batch dimension

    except Exception as e:
        print(f"An error occurred during image preprocessing: {e}")
        return None

def main():
    """Main function to run the command-line demonstration."""
    print("--- FractureAI Model Demonstration ---")

    # Step 1: Check if the model file exists
    if not os.path.exists(MODEL_PATH):
        print(f"\n[ERROR] Model file not found at '{MODEL_PATH}'")
        print("Please make sure 'fracture_model.h5' is in the 'backend' directory.")
        return

    # Step 2: Load the pre-trained model
    print(f"\n1. Loading model from '{MODEL_PATH}'...")
    try:
        # Suppress TensorFlow warnings for a cleaner demo
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print("   ✅ Model loaded successfully.")
    except Exception as e:
        print(f"\n[ERROR] An error occurred while loading the model: {e}")
        return

    # Step 3: Get the image path from the user
    if len(sys.argv) < 2:
        print("\n[INFO] How to use this script:")
        print("       python demo.py <path_to_your_xray_image>")
        print("\nExample:")
        print("       python demo.py sample_images/fractured_xray.jpg")
        return
        
    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print(f"\n[ERROR] The image file '{image_path}' was not found.")
        return

    print(f"\n2. Preparing image: '{image_path}'...")
    processed_image = preprocess_image(image_path)
    
    if processed_image is None:
        return 
    print("   ✅ Image preprocessed successfully.")

    # Step 4: Make a prediction
    print("\n3. Running AI analysis...")
    try:
        prediction = model.predict(processed_image)
        confidence = np.max(prediction)
        predicted_class_index = np.argmax(prediction)
        predicted_class_name = CLASS_NAMES[predicted_class_index]
        print("   ✅ Analysis complete.")
    except Exception as e:
        print(f"\n[ERROR] An error occurred during prediction: {e}")
        return

    # Step 5: Display the result in a clean format
    print("\n" + "="*30)
    print("      ANALYSIS RESULT")
    print("="*30)
    print(f"  Prediction:     {predicted_class_name.replace('_', ' ').upper()}")
    print(f"  Confidence:     {(confidence * 100):.2f}%")
    print("="*30)

# This allows the script to be run directly from the terminal
if __name__ == '__main__':
    main()