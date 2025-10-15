import os
import sys
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from keras.models import load_model
import uuid

# --- App & Model Initialization ---
app = Flask(__name__)
CORS(app)

MODEL_PATH = 'fracture_model.h5'
print("--- Loading FractureAI Model ---")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
model = load_model(MODEL_PATH)
class_names = ['comminuted_fracture', 'no_fracture', 'simple_fracture']
print("--- ✅ Model Loaded Successfully. Ready for predictions. ---")

def preprocess_image(image_file):
    """Loads and preprocesses an image for the model."""
    try:
        filestr = image_file.read()
        npimg = np.frombuffer(filestr, np.uint8)
        img_gray = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
        img_color = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        if img_gray is None or img_color is None:
            raise ValueError("Could not decode image")

        img_resized_gray = cv2.resize(img_gray, (150, 150))
        img_array = img_resized_gray / 255.0
        img_reshaped = np.reshape(img_array, (1, 150, 150, 1))

        return img_reshaped, img_color
    except Exception as e:
        print(f"Error preprocessing image: {e}", file=sys.stderr)
        return None, None

def make_gradcam_heatmap(img_array, model, last_conv_layer_name):
    """Creates a Grad-CAM heatmap using a robust method."""
    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + tf.keras.backend.epsilon())
    return heatmap.numpy()

def overlay_heatmap_and_draw_bbox(original_img, heatmap):
    """Overlays the heatmap and draws a bounding box."""
    heatmap_resized = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    
    thresh = cv2.threshold(heatmap_uint8, 127, 255, cv2.THRESH_BINARY)[1]
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    annotated_img = original_img.copy()

    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_contour)
        cv2.rectangle(annotated_img, (x, y), (x + w, y + h), (36, 255, 12), 2)

    return annotated_img

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    processed_image, original_color_img = preprocess_image(image_file)

    if processed_image is None:
        return jsonify({'error': 'Failed to preprocess image'}), 500
    
    prediction = model.predict(processed_image, verbose=0)
    predicted_class_index = np.argmax(prediction)
    predicted_class_name = class_names[predicted_class_index]
    confidence = float(np.max(prediction))

    try:
        last_conv_layer_name = None
        for layer in reversed(model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                last_conv_layer_name = layer.name
                break
        
        if not last_conv_layer_name:
            raise Exception("Could not find a convolutional layer for Grad-CAM.")

        heatmap = make_gradcam_heatmap(processed_image, model, last_conv_layer_name)
        annotated_image = overlay_heatmap_and_draw_bbox(original_color_img.copy(), heatmap)
        
        if not os.path.exists('uploads'):
            os.makedirs('uploads')

        unique_filename = str(uuid.uuid4()) + '.jpg'
        annotated_image_path = os.path.join('uploads', 'annotated_' + unique_filename)
        cv2.imwrite(annotated_image_path, annotated_image)

        result = {
            "prediction": predicted_class_name,
            "confidence": confidence,
            "annotatedImagePath": annotated_image_path.replace('\\', '/')
        }
        return jsonify(result)

    except Exception as e:
        print(f"Error during Grad-CAM or image saving: {e}", file=sys.stderr)
        result = {
            "prediction": predicted_class_name,
            "confidence": confidence,
            "annotatedImagePath": None
        }
        return jsonify(result)

if __name__ == '__main__':
    app.run(port=5002)