# Getting Your Backend URL

## After Render Deployment

Once your Render deployment is complete:

1. **Go to your Render dashboard**
2. **Find your web service** (should be named something like `pneumonia-detection-api`)
3. **Copy the URL** - it will look like: `https://pneumonia-detection-api-xxxxx.onrender.com`
4. **Add `/api` to the end** - your full API URL will be: `https://pneumonia-detection-api-xxxxx.onrender.com/api`

## Setting in Cloudflare Pages

1. **Go to your Cloudflare Pages dashboard**
2. **Select your project**
3. **Go to Settings → Environment variables**
4. **Add a new variable**:
   - **Variable name**: `REACT_APP_API_URL`
   - **Value**: `https://pneumonia-detection-api-xxxxx.onrender.com/api`
5. **Save and redeploy**

## Testing the Connection

You can test if your backend is working by visiting:
`https://pneumonia-detection-api-xxxxx.onrender.com/api/health`

You should see a JSON response like:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Example URLs

- **Backend API**: `https://pneumonia-detection-api-abc123.onrender.com/api`
- **Frontend**: `https://your-project-name.pages.dev`

The frontend will automatically use the backend URL you set in the environment variable. 