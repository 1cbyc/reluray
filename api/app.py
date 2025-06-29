from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image
import io
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Debug: Print current working directory and check for model file
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")
if os.path.exists('../best_model.keras'):
    print("✅ Model file found at ../best_model.keras")
else:
    print("❌ Model file not found at ../best_model.keras")
    # Try alternative paths
    if os.path.exists('best_model.keras'):
        print("✅ Model file found at best_model.keras")
    elif os.path.exists('./best_model.keras'):
        print("✅ Model file found at ./best_model.keras")

# Load the trained model
try:
    model_path = '../best_model.keras'
    if not os.path.exists(model_path):
        # Try alternative paths
        if os.path.exists('best_model.keras'):
            model_path = 'best_model.keras'
        elif os.path.exists('./best_model.keras'):
            model_path = './best_model.keras'
        else:
            raise FileNotFoundError(f"Model file not found. Checked paths: ../best_model.keras, best_model.keras, ./best_model.keras")
    
    model = load_model(model_path)
    print(f"✅ Model loaded successfully from {model_path}!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

def preprocess_image(image_data):
    """Preprocess image for model prediction"""
    try:
        # Convert base64 to image
        if isinstance(image_data, str) and image_data.startswith('data:image'):
            # Remove data URL prefix
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize((224, 224))
        
        # Convert to array and normalize
        img_array = img_to_array(image)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict pneumonia from uploaded image"""
    if model is None:
        return jsonify({
            'error': 'Model not loaded',
            'status': 'error'
        }), 500
    
    try:
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                'error': 'No image data provided',
                'status': 'error'
            }), 400
        
        image_data = data['image']
        
        # Preprocess image
        processed_image = preprocess_image(image_data)
        if processed_image is None:
            return jsonify({
                'error': 'Failed to process image',
                'status': 'error'
            }), 400
        
        # Make prediction
        prediction = model.predict(processed_image)
        confidence = float(prediction[0][0])
        
        # Determine result
        if confidence > 0.5:
            result = 'Pneumonia'
            final_confidence = confidence
        else:
            result = 'Normal'
            final_confidence = 1 - confidence
        
        return jsonify({
            'prediction': result,
            'confidence': round(final_confidence, 3),
            'raw_confidence': round(confidence, 3),
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({
            'error': 'Failed to analyze image',
            'status': 'error'
        }), 500

@app.route('/api/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        'model_name': 'VGG16 Transfer Learning',
        'architecture': 'Convolutional Neural Network',
        'training_data': 'Chest X-ray Pneumonia Dataset',
        'classes': ['Normal', 'Pneumonia'],
        'input_size': '224x224x3',
        'framework': 'TensorFlow/Keras',
        'status': 'success'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 