import os
import sys
import json
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model

# --- App & Model Initialization ---
# This code runs only ONCE when the server starts.
app = Flask(__name__)
CORS(app) # Allows the Node.js server to talk to this server

MODEL_PATH = 'fracture_model.h5'
print("--- Loading FractureAI Model ---")
# Suppress TensorFlow informational messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
model = load_model(MODEL_PATH)
class_names = ['comminuted_fracture', 'no_fracture', 'simple_fracture']
print("--- ✅ Model Loaded Successfully. Ready for predictions. ---")
# ---

def preprocess_image(image_file):
    """Loads and preprocesses an image for the model."""
    try:
        # Read image from in-memory buffer
        filestr = image_file.read()
        npimg = np.frombuffer(filestr, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
        
        img_resized = cv2.resize(img, (150, 150))
        img_array = img_resized / 255.0
        img_reshaped = np.reshape(img_array, (1, 150, 150, 1))
        return img_reshaped
    except Exception as e:
        print(f"Error preprocessing image: {e}", file=sys.stderr)
        return None

# --- API Endpoint for Predictions ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    processed_image = preprocess_image(image_file)

    if processed_image is None:
        return jsonify({'error': 'Failed to preprocess image'}), 500

    # Make prediction using the pre-loaded model
    prediction = model.predict(processed_image, verbose=0)
    
    # Process result
    predicted_class_index = np.argmax(prediction)
    predicted_class_name = class_names[predicted_class_index]
    confidence = float(np.max(prediction))

    result = {
        "prediction": predicted_class_name,
        "confidence": confidence
    }
    
    return jsonify(result)

if __name__ == '__main__':
    # Start the Flask server on port 5002
    app.run(port=5002)