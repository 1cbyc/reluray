"""
Test version of API that runs without TensorFlow
Use this to test API structure when TensorFlow is not available
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS
cors_origins = os.environ.get('CORS_ORIGINS', '*')
CORS(app, origins=cors_origins.split(',') if cors_origins != '*' else ['*'])

# Mock model for testing
model = None
MODEL_LOADED = False

logger.info("Running in TEST MODE (TensorFlow not required)")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': MODEL_LOADED,
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'mode': 'test'
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    """Mock predict endpoint"""
    start_time = time.time()
    
    if not MODEL_LOADED:
        return jsonify({
            'error': 'Model not loaded (TEST MODE)',
            'status': 'error'
        }), 503
    
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                'error': 'No image data provided',
                'status': 'error'
            }), 400
        
        # Mock prediction
        import random
        confidence = random.uniform(0.3, 0.9)
        result = 'Pneumonia' if confidence > 0.5 else 'Normal'
        final_confidence = confidence if result == 'Pneumonia' else 1 - confidence
        
        total_time = time.time() - start_time
        
        return jsonify({
            'prediction': result,
            'confidence': round(final_confidence, 3),
            'raw_confidence': round(confidence, 3),
            'timestamp': datetime.now().isoformat(),
            'processing_time': round(total_time, 3),
            'status': 'success',
            'mode': 'test'
        }), 200
        
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        return jsonify({
            'error': 'Failed to analyze image',
            'status': 'error'
        }), 500

@app.route('/api/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        'model_name': 'VGG16 Transfer Learning (TEST MODE)',
        'architecture': 'Convolutional Neural Network',
        'training_data': 'Chest X-ray Pneumonia Dataset',
        'classes': ['Normal', 'Pneumonia'],
        'input_size': '224x224x3',
        'framework': 'TensorFlow/Keras',
        'model_loaded': MODEL_LOADED,
        'mode': 'test',
        'status': 'success'
    }), 200

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting Flask API in TEST MODE on port {port}")
    logger.info("Note: This is a test version without TensorFlow")
    app.run(host='0.0.0.0', port=port, debug=True)
