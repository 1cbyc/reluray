import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# to load the trained model
model = load_model('final_model.keras')

# to define the function for prediction
def predict_image(image_path):
    img = load_img(image_path, target_size=(224, 224))  # will resize the image to match the input size
    img_array = img_to_array(img) / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    prediction = model.predict(img_array)
    class_label = 'Pneumonia' if prediction[0][0] > 0.5 else 'Normal'
    confidence = prediction[0][0] if class_label == 'Pneumonia' else 1 - prediction[0][0]
    return class_label, confidence

# Example usage
image_path = '/path/to/test/image.jpg'  # Replace with the path to your test image
if os.path.exists(image_path):
    label, confidence = predict_image(image_path)
    print(f"Prediction: {label} (Confidence: {confidence:.2f})")
else:
    print("Image not found. Please check the path.")
