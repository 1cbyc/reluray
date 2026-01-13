#!/usr/bin/env python3
import os
import sys

print("=== Deployment Environment Test ===")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")

# Check if we're in the right directory
if 'api' in os.listdir('.'):
    print("✅ Found 'api' directory")
else:
    print("❌ 'api' directory not found")

# Check for model file
model_paths = ['../best_model.keras', 'best_model.keras', './best_model.keras']
for path in model_paths:
    if os.path.exists(path):
        print(f"✅ Model file found at: {path}")
        break
else:
    print("❌ Model file not found in any expected location")

# Check if we can import required modules
try:
    import flask
    print("✅ Flask imported successfully")
except ImportError as e:
    print(f"❌ Flask import failed: {e}")

try:
    import tensorflow
    print("✅ TensorFlow imported successfully")
except ImportError as e:
    print(f"❌ TensorFlow import failed: {e}")

print("=== Test Complete ===") 