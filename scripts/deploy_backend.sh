#!/bin/bash

# Script to help deploy backend to Railway
# This script provides instructions and checks prerequisites

set -e

echo "=== Railway Backend Deployment Helper ==="
echo ""

# Check if model file exists
if [ ! -f "best_model.keras" ]; then
    echo "ERROR: best_model.keras not found in repository root!"
    echo "Please ensure the model file is in the repository before deploying."
    exit 1
fi

echo "✓ Model file found: best_model.keras"
echo ""

# Check railway.json
if [ ! -f "backend/railway.json" ]; then
    echo "ERROR: backend/railway.json not found!"
    exit 1
fi

echo "✓ Railway configuration found"
echo ""

echo "=== Deployment Steps ==="
echo ""
echo "1. Go to https://railway.app/dashboard"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select your repository"
echo "4. Railway will auto-detect railway.json"
echo ""
echo "=== Required Environment Variables ==="
echo ""
echo "Set these in Railway project settings:"
echo ""
echo "ENVIRONMENT=production"
echo "CORS_ORIGINS=https://your-frontend.vercel.app"
echo "PYTHON_VERSION=3.12"
echo ""
echo "Note: Update CORS_ORIGINS after frontend is deployed"
echo ""
echo "=== Verification ==="
echo ""
echo "After deployment, check:"
echo "1. Health endpoint: https://your-backend.railway.app/api/health"
echo "2. API docs: https://your-backend.railway.app/api/docs"
echo "3. Check logs to verify model loaded successfully"
echo ""
