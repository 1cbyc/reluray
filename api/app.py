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
        # Validate input
        if not image_data or not isinstance(image_data, str):
            logger.error("Invalid image data: not a string")
            return None
        
        # Extract base64 data
        if image_data.startswith('data:image'):
            # Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            image_data = image_data.split(',')[1]
        
        # Decode base64
        try:
            image_bytes = base64.b64decode(image_data, validate=True)
        except Exception as e:
            logger.error(f"Invalid base64 encoding: {e}")
            return None
        
        # Validate image size
        if len(image_bytes) > MAX_IMAGE_SIZE:
            logger.warning(f"Image too large: {len(image_bytes)} bytes (max: {MAX_IMAGE_SIZE})")
            return None
        
        # Open and validate image
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()  # Verify it's a valid image
        except Exception as e:
            logger.error(f"Invalid image file: {e}")
            return None
        
        # Reopen image (verify() closes it)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize(MODEL_INPUT_SIZE, Image.Resampling.LANCZOS)
        
        # Convert to array and normalize
        img_array = img_to_array(image)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        logger.debug(f"Image preprocessed: shape={img_array.shape}")
        return img_array
        
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}", exc_info=True)
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict pneumonia from uploaded image"""
    start_time = time.time()
    
    if model is None:
        logger.error("Prediction attempted but model is not loaded")
        return jsonify({
            'error': 'Model not loaded. Please check server logs.',
            'status': 'error'
        }), 503
    
    try:
        # Validate request
        if not request.is_json:
            return jsonify({
                'error': 'Request must be JSON',
                'status': 'error'
            }), 400
        
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            logger.warning("Prediction request missing image data")
            return jsonify({
                'error': 'No image data provided. Please include "image" field in request body.',
                'status': 'error'
            }), 400
        
        image_data = data['image']
        
        # Preprocess image
        logger.info("Preprocessing image...")
        processed_image = preprocess_image(image_data)
        if processed_image is None:
            logger.warning("Image preprocessing failed")
            return jsonify({
                'error': 'Failed to process image. Please ensure the image is valid and under 10MB.',
                'status': 'error'
            }), 400
        
        # Make prediction
        logger.info("Running model prediction...")
        prediction_start = time.time()
        prediction = model.predict(processed_image, verbose=0)
        prediction_time = time.time() - prediction_start
        
        confidence = float(prediction[0][0])
        
        # Determine result
        if confidence > 0.5:
            result = 'Pneumonia'
            final_confidence = confidence
        else:
            result = 'Normal'
            final_confidence = 1 - confidence
        
        total_time = time.time() - start_time
        
        logger.info(f"Prediction completed: {result} (confidence: {final_confidence:.3f}, time: {total_time:.2f}s)")
        
        return jsonify({
            'prediction': result,
            'confidence': round(final_confidence, 3),
            'raw_confidence': round(confidence, 3),
            'timestamp': datetime.now().isoformat(),
            'processing_time': round(total_time, 3),
            'status': 'success'
        }), 200
        
    except ValueError as e:
        logger.error(f"Value error in prediction: {e}", exc_info=True)
        return jsonify({
            'error': 'Invalid request data',
            'status': 'error'
        }), 400
    except Exception as e:
        logger.error(f"Unexpected error in prediction: {e}", exc_info=True)
        return jsonify({
            'error': 'Failed to analyze image. Please try again.',
            'status': 'error'
        }), 500

@app.route('/api/info', methods=['GET'])
def model_info():
    """Get model information"""
    info = {
        'model_name': 'VGG16 Transfer Learning',
        'architecture': 'Convolutional Neural Network',
        'training_data': 'Chest X-ray Pneumonia Dataset',
        'classes': ['Normal', 'Pneumonia'],
        'input_size': '224x224x3',
        'framework': 'TensorFlow/Keras',
        'model_loaded': model is not None,
        'status': 'success'
    }
    
    if model is not None:
        info['model_input_shape'] = str(model.input_shape)
        info['model_output_shape'] = str(model.output_shape)
    
    return jsonify(info), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'status': 'error'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'error': 'Method not allowed',
        'status': 'error'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}", exc_info=True)
    return jsonify({
        'error': 'Internal server error',
        'status': 'error'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Flask application on port {port}")
    logger.info(f"Debug mode: {debug}")
    logger.info(f"Model loaded: {model is not None}")
    
    app.run(host='0.0.0.0', port=port, debug=debug) 