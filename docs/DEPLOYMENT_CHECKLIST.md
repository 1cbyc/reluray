# Deployment Checklist

Use this checklist to ensure all deployment steps are completed correctly.

## Pre-Deployment

### Repository
- [ ] `best_model.keras` is in repository root
- [ ] All code changes committed to `dev` branch
- [ ] `.gitignore` properly excludes data files
- [ ] No sensitive data in repository

### Backend Preparation
- [ ] `backend/railway.json` is configured correctly
- [ ] `backend/requirements.txt` has all dependencies
- [ ] `backend/app.py` has proper CORS configuration
- [ ] Model loading logic is production-ready

### Frontend Preparation
- [ ] `frontend/vercel.json` is configured correctly
- [ ] `frontend/package.json` has all dependencies
- [ ] `frontend/src/services/api.js` uses environment variables
- [ ] Build command works locally: `npm run build`

## Backend Deployment (Railway)

### Initial Setup
- [ ] Railway account created
- [ ] GitHub repository connected to Railway
- [ ] Project created from repository

### Configuration
- [ ] Environment variables set:
  - [ ] `ENVIRONMENT=production`
  - [ ] `CORS_ORIGINS` (will update after frontend deploy)
  - [ ] `PYTHON_VERSION=3.12`
- [ ] `railway.json` detected and used
- [ ] Build completes successfully

### Verification
- [ ] Deployment successful (green status)
- [ ] Backend URL obtained (e.g., `https://xxx.railway.app`)
- [ ] Health endpoint works: `/api/health`
- [ ] API docs accessible: `/api/docs`
- [ ] Model loads successfully (check logs)
- [ ] Health endpoint returns `model_loaded: true`

## Frontend Deployment (Vercel)

### Initial Setup
- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project created from repository

### Configuration
- [ ] Root directory set to `frontend`
- [ ] Build settings configured:
  - [ ] Framework: Create React App
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Environment variables set:
  - [ ] `REACT_APP_API_URL` (Railway backend URL)

### Verification
- [ ] Build completes successfully
- [ ] Deployment successful
- [ ] Frontend URL obtained (e.g., `https://xxx.vercel.app`)
- [ ] Frontend loads without errors
- [ ] No console errors in browser

## Post-Deployment Configuration

### Update CORS
- [ ] Update Railway `CORS_ORIGINS` with Vercel frontend URL
- [ ] Restart Railway service
- [ ] Verify CORS headers in browser DevTools

### End-to-End Testing
- [ ] Frontend can connect to backend
- [ ] Health check works from frontend
- [ ] Image upload works
- [ ] Prediction returns results
- [ ] Error handling works (test with invalid image)
- [ ] Loading states display correctly
- [ ] Results display correctly

## Production Verification

### Security
- [ ] CORS only allows frontend domain (not `*`)
- [ ] No hardcoded credentials in code
- [ ] Environment variables properly set
- [ ] HTTPS enabled (automatic on both platforms)

### Performance
- [ ] Backend responds within acceptable time
- [ ] Model predictions complete in < 5 seconds
- [ ] Frontend loads quickly
- [ ] Images upload efficiently

### Monitoring
- [ ] Railway logs accessible
- [ ] Vercel logs accessible
- [ ] Error tracking set up (if applicable)
- [ ] Uptime monitoring configured (optional)

## Documentation
- [ ] Deployment URLs documented
- [ ] Environment variables documented
- [ ] Troubleshooting steps documented
- [ ] Team members have access to both platforms

## Rollback Plan
- [ ] Know how to rollback Railway deployment
- [ ] Know how to rollback Vercel deployment
- [ ] Previous working version identified

## Completion
- [ ] All checklist items completed
- [ ] Deployment tested by team members
- [ ] Production URLs shared with stakeholders
- [ ] Monitoring alerts configured

---

**Last Updated:** 2026-01-19  
**Status:** Ready for deployment
