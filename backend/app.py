from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import io
import base64
import logging
from datetime import datetime
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ReluRay API",
    description="AI-powered medical image analysis API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Configure CORS
cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')
if cors_origins == ['*']:
    logger.warning("CORS is set to allow all origins. For production, set CORS_ORIGINS environment variable.")
    allow_origins = ['*']
else:
    allow_origins = cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MODEL_INPUT_SIZE = (224, 224)

# Pydantic models for request/response validation
class PredictRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image data")

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    timestamp: str
    version: str

class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    raw_confidence: Optional[float] = None
    timestamp: str
    processing_time: float
    status: str

class ErrorResponse(BaseModel):
    error: str
    status: str

class ModelInfoResponse(BaseModel):
    model_name: str
    architecture: str
    training_data: str
    classes: list
    input_size: str
    framework: str
    model_loaded: bool
    model_input_shape: Optional[str] = None
    model_output_shape: Optional[str] = None
    status: str

# Model loading with better path resolution
def find_model_file():
    """Find the model file in common locations"""
    possible_paths = [
        '../best_model.keras',  # From backend/ directory (in repository root)
        '../../best_model.keras',  # Alternative path
        'best_model.keras',      # In current directory
        './best_model.keras',   # Current directory
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'best_model.keras'),  # Absolute from backend/
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

def preprocess_image(image_data: str):
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

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return HealthResponse(
        status='healthy',
        model_loaded=model is not None,
        timestamp=datetime.now().isoformat(),
        version='1.0.0'
    )

@app.post("/api/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict(request: PredictRequest):
    """Predict pneumonia from uploaded image"""
    start_time = time.time()
    
    if model is None:
        logger.error("Prediction attempted but model is not loaded")
        raise HTTPException(
            status_code=503,
            detail='Model not loaded. Please check server logs.'
        )
    
    try:
        image_data = request.image
        
        # Preprocess image
        logger.info("Preprocessing image...")
        processed_image = preprocess_image(image_data)
        if processed_image is None:
            logger.warning("Image preprocessing failed")
            raise HTTPException(
                status_code=400,
                detail='Failed to process image. Please ensure the image is valid and under 10MB.'
            )
        
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
        
        return PredictResponse(
            prediction=result,
            confidence=round(final_confidence, 3),
            raw_confidence=round(confidence, 3),
            timestamp=datetime.now().isoformat(),
            processing_time=round(total_time, 3),
            status='success'
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Value error in prediction: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail='Invalid request data')
    except Exception as e:
        logger.error(f"Unexpected error in prediction: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail='Failed to analyze image. Please try again.')

@app.get("/api/info", response_model=ModelInfoResponse, tags=["Info"])
async def model_info():
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
    
    return ModelInfoResponse(**info)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            'error': 'Internal server error',
            'status': 'error'
        }
    )

if __name__ == '__main__':
    import uvicorn
    # Use 5001 instead of 5000 to avoid macOS AirPlay conflict
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FASTAPI_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting FastAPI application on port {port}")
    logger.info(f"Debug mode: {debug}")
    logger.info(f"Model loaded: {model is not None}")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=debug,
        log_level="info"
    )
