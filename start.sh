#!/bin/bash
echo "Starting Flask application..."
echo "Current directory: $(pwd)"
echo "PORT environment variable: $PORT"

# Set default port if not provided
PORT=${PORT:-5000}

# Start gunicorn with production settings
exec gunicorn \
    --bind 0.0.0.0:$PORT \
    --workers 4 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    api.app:app 