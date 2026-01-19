#!/bin/bash

# Script to help deploy frontend to Vercel
# This script provides instructions and checks prerequisites

set -e

echo "=== Vercel Frontend Deployment Helper ==="
echo ""

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "ERROR: frontend directory not found!"
    exit 1
fi

echo "✓ Frontend directory found"
echo ""

# Check vercel.json
if [ ! -f "frontend/vercel.json" ]; then
    echo "ERROR: frontend/vercel.json not found!"
    exit 1
fi

echo "✓ Vercel configuration found"
echo ""

# Check if build works
echo "Testing build..."
cd frontend
if npm run build > /dev/null 2>&1; then
    echo "✓ Build test successful"
else
    echo "WARNING: Build test failed. Check for errors above."
fi
cd ..

echo ""
echo "=== Deployment Steps ==="
echo ""
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Add New Project'"
echo "3. Import your GitHub repository"
echo "4. Configure project:"
echo "   - Root Directory: frontend"
echo "   - Framework: Create React App"
echo "   - Build Command: npm run build"
echo "   - Output Directory: build"
echo ""
echo "=== Required Environment Variables ==="
echo ""
echo "Set in Vercel project settings → Environment Variables:"
echo ""
echo "REACT_APP_API_URL=https://your-backend.railway.app/api"
echo ""
echo "Replace with your actual Railway backend URL"
echo ""
echo "=== After Deployment ==="
echo ""
echo "1. Get your Vercel frontend URL"
echo "2. Update Railway CORS_ORIGINS with frontend URL"
echo "3. Restart Railway service"
echo "4. Test end-to-end functionality"
echo ""
