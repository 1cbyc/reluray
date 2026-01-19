# Deployment Guide

This guide covers deploying ReluRay to production using Railway (backend) and Vercel (frontend).

## Prerequisites

- GitHub account with repository access
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Model file (`best_model.keras`) in repository root

## Backend Deployment (Railway)

### Step 1: Connect Repository

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `reluray` repository
5. Railway will detect `railway.json` automatically

### Step 2: Configure Environment Variables

In Railway project settings, add these environment variables:

```
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend.vercel.app
PORT=5001
PYTHON_VERSION=3.12
```

**Important:** Replace `https://your-frontend.vercel.app` with your actual Vercel frontend URL after deployment.

### Step 3: Verify Model File

Ensure `best_model.keras` is in the repository root. Railway will:
- Build the backend
- Install dependencies
- Start the server with Uvicorn

### Step 4: Check Deployment

1. Railway will provide a URL like `https://your-app.railway.app`
2. Visit `https://your-app.railway.app/api/docs` to see API documentation
3. Test health endpoint: `https://your-app.railway.app/api/health`

### Step 5: Verify Model Loading

Check the Railway logs to ensure:
- Model file is found
- Model loads successfully
- Health endpoint returns `model_loaded: true`

## Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect React app

### Step 2: Configure Project Settings

**Root Directory:** `frontend`

**Build Settings:**
- Framework Preset: Create React App
- Build Command: `npm run build`
- Output Directory: `build`

### Step 3: Set Environment Variables

In Vercel project settings → Environment Variables, add:

```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

**Important:** Replace with your actual Railway backend URL.

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. You'll get a URL like `https://your-app.vercel.app`

### Step 5: Update Backend CORS

After frontend is deployed, update Railway environment variable:

```
CORS_ORIGINS=https://your-app.vercel.app
```

Restart the Railway service for changes to take effect.

## Post-Deployment Checklist

### Backend (Railway)

- [ ] Health endpoint responds: `/api/health`
- [ ] Model loads successfully (check logs)
- [ ] API docs accessible: `/api/docs`
- [ ] CORS configured for frontend domain
- [ ] Environment variables set correctly

### Frontend (Vercel)

- [ ] Frontend loads without errors
- [ ] API connection works (check browser console)
- [ ] Image upload works
- [ ] Predictions return results
- [ ] Error handling works correctly

### End-to-End Testing

- [ ] Upload a test X-ray image
- [ ] Verify prediction returns
- [ ] Check confidence scores
- [ ] Test error scenarios (invalid image, network error)
- [ ] Verify CORS headers in browser DevTools

## Troubleshooting

### Backend Issues

**Model not loading:**
- Check Railway logs for model path errors
- Verify `best_model.keras` is in repository root
- Check file permissions

**CORS errors:**
- Verify `CORS_ORIGINS` includes your frontend URL
- Check for trailing slashes in URLs
- Ensure `ENVIRONMENT=production` is set

**Port issues:**
- Railway sets `$PORT` automatically
- Don't hardcode port numbers

### Frontend Issues

**API connection fails:**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS configuration in backend
- Test backend URL directly in browser

**Build fails:**
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Check build logs for specific errors

## Environment Variables Reference

### Backend (Railway)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENVIRONMENT` | Yes | `development` | Set to `production` |
| `CORS_ORIGINS` | Yes | - | Comma-separated frontend URLs |
| `PORT` | No | `5001` | Railway sets this automatically |
| `PYTHON_VERSION` | No | `3.12` | Python version |

### Frontend (Vercel)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | Yes | `http://localhost:5001/api` | Backend API URL |

## Security Notes

1. **CORS:** Never use `*` in production. Always specify exact frontend domains.
2. **Environment Variables:** Never commit `.env` files. Use platform environment variable settings.
3. **API Keys:** If you add API keys later, store them in environment variables, not in code.

## Monitoring

### Railway

- Check logs: Railway Dashboard → Your Project → Deployments → Logs
- Monitor resource usage in project settings

### Vercel

- Check build logs: Vercel Dashboard → Your Project → Deployments
- Monitor analytics in project dashboard

## Next Steps

After successful deployment:

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic on both platforms)
3. Set up monitoring and alerts
4. Configure CI/CD for automatic deployments
