# ReluRay API

FastAPI for medical image analysis from chest X-ray images.

## Features

- **FastAPI**: Modern, fast, async-capable framework
- **Automatic API Documentation**: OpenAPI/Swagger UI at `/api/docs`
- **Type Safety**: Pydantic models for request/response validation
- **Production Ready**: Uvicorn ASGI server
- **Medical Image Analysis**: VGG16-based pneumonia detection

## Endpoints

### `GET /api/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2025-01-13T12:00:00",
  "version": "1.0.0"
}
```

### `POST /api/predict`
Predict pneumonia from uploaded chest X-ray image.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "prediction": "Pneumonia",
  "confidence": 0.95,
  "raw_confidence": 0.95,
  "timestamp": "2025-01-13T12:00:00",
  "processing_time": 2.34,
  "status": "success"
}
```

### `GET /api/info`
Get model information.

**Response:**
```json
{
  "model_name": "VGG16 Transfer Learning",
  "architecture": "Convolutional Neural Network",
  "training_data": "Chest X-ray Pneumonia Dataset",
  "classes": ["Normal", "Pneumonia"],
  "input_size": "224x224x3",
  "framework": "TensorFlow/Keras",
  "model_loaded": true,
  "model_input_shape": "(None, 224, 224, 3)",
  "model_output_shape": "(None, 1)",
  "status": "success"
}
```

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `/api/docs` - Interactive API documentation
- **ReDoc**: `/api/redoc` - Alternative API documentation

## Local Development

1. **Activate virtual environment:**
   ```bash
   source ../venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the API:**
   ```bash
   python app.py
   ```
   
   Or use uvicorn directly:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 5000
   ```

4. **Access the API:**
   - API: http://localhost:5000
   - Docs: http://localhost:5000/api/docs
   - Health: http://localhost:5000/api/health

5. **Test the API:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## Production Deployment

### Railway

The API is configured to run on Railway with Uvicorn:

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT --workers 4
```

Or use the start script:
```bash
./start.sh
```

### Environment Variables

- `PORT`: Server port (default: 5000)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: *)
- `FASTAPI_DEBUG`: Enable debug mode (default: False)

### Model File

Ensure `best_model.keras` is in the repository root. The API will automatically find it in:
- `../best_model.keras` (from backend/ directory)
- `best_model.keras` (in root)
- `./best_model.keras` (current directory)

## Features

- Production-ready with Uvicorn
- Comprehensive error handling
- Automatic request/response validation (Pydantic)
- Image size validation (max 10MB)
- Structured logging
- CORS configuration
- Health check endpoint
- Processing time tracking
- Automatic API documentation

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid input)
- `404`: Endpoint not found
- `500`: Internal server error
- `503`: Service unavailable (model not loaded)

All errors follow the standard format:
```json
{
  "error": "Error message",
  "status": "error"
}
```

## Logging

The API uses Python's logging module with structured logs:
- INFO: Normal operations
- WARNING: Non-critical issues
- ERROR: Errors that need attention

Logs are output to stdout/stderr for Railway to capture.

## Technology Stack

- **FastAPI 0.109.0**: Modern web framework
- **Uvicorn 0.27.0**: ASGI server
- **Pydantic 2.5.3**: Data validation
- **TensorFlow 2.16.1**: ML framework
- **Pillow 10.0.0**: Image processing
