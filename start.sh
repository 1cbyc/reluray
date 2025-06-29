#!/bin/bash
echo "Starting Flask application..."
echo "Current directory: $(pwd)"
echo "Files in current directory: $(ls -la)"
echo "PORT environment variable: $PORT"

# Start gunicorn
exec gunicorn --bind 0.0.0.0:$PORT api.app:app 