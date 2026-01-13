from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image
import io
import base64
import logging
import hashlib
from datetime import datetime
from functools import wraps
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS - allow all origins in development, restrict in production
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    logger.warning("CORS is set to allow all origins. For production, set CORS_ORIGINS environment variable.")
CORS(app, origins=cors_origins.split(',') if cors_origins != '*' else ['*'])

# Configuration
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MODEL_INPUT_SIZE = (224, 224)

# Model loading with better path resolution
def find_model_file():
    """Find the model file in common locations"""
    possible_paths = [
        '../best_model.keras',  # From api/ directory
        'best_model.keras',      # In root
        './best_model.keras',   # Current directory
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'best_model.keras'),  # Absolute from api/
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            logger.info(f"Model file found at: {os.path.abspath(path)}")
            return path
    
    return None

# Load the trained model
model = None
model_path = find_model_file()

if model_path:
    try:
        logger.info(f"Loading model from: {model_path}")
        model = load_model(model_path)
        logger.info("✅ Model loaded successfully!")
        
        # Log model summary
        logger.info(f"Model input shape: {model.input_shape}")
        logger.info(f"Model output shape: {model.output_shape}")
    except Exception as e:
        logger.error(f"❌ Error loading model: {e}", exc_info=True)
        model = None
else:
    logger.error("❌ Model file not found in any expected location")
    logger.error(f"Current working directory: {os.getcwd()}")
    logger.error(f"Files in current directory: {os.listdir('.')}")

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