import sys
import json
import numpy as np
import cv2
from tensorflow.keras.models import load_model

if __name__ == "__main__":
    try:
        image_path = sys.argv[1]
        model = load_model('fracture_model.h5')
        class_names = ['comminuted_fracture', 'no_fracture', 'simple_fracture']

        # Image Preprocessing
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        img = cv2.resize(img, (150, 150))
        img = img / 255.0
        img = np.reshape(img, (1, 150, 150, 1))

        # Prediction (with verbose=0 to hide progress bar)
        prediction = model.predict(img, verbose=0)

        # Process result
        predicted_class_index = np.argmax(prediction)
        predicted_class_name = class_names[predicted_class_index]
        confidence = float(np.max(prediction))

        result = {
            "prediction": predicted_class_name,
            "confidence": confidence
        }
        
        # Print the clean JSON result
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        # Print any fatal error to the error stream
        print(f"A fatal error occurred in predict.py: {e}", file=sys.stderr)
        sys.exit(1)