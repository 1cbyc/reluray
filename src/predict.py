import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# to load the trained model
# model = load_model('best_model.keras')
model = load_model('../best_model.keras')

# to define the function for prediction
def predict_image(image_path):
    img = load_img(image_path, target_size=(224, 224))  # will resize the image to match the input size
    img_array = img_to_array(img) / 255.0  # for it to normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # then add batch dimension

    prediction = model.predict(img_array)
    class_label = 'Pneumonia' if prediction[0][0] > 0.5 else 'Normal'
    confidence = prediction[0][0] if class_label == 'Pneumonia' else 1 - prediction[0][0]
    return class_label, confidence

# how i will use it
# image_path = 'tests/scans/IM-0029-0001.jpeg'  # for now, will manually replace with the path to test image
image_path = '../tests/scans/IM-0029-0001.jpeg'  # for now, will manually replace with the path to test image
if os.path.exists(image_path):
    label, confidence = predict_image(image_path)
    print(f"Prediction: {label} (Confidence: {confidence:.2f})")
else:
    print("Image not found. Please check the path.")
