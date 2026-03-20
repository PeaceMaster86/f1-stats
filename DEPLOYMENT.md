# Deployment Guide

## Deploying F1 Statistics Website

This guide covers deploying both the backend and frontend to various platforms.

## Option 1: Vercel (Recommended for Frontend)

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Select the `client` directory as root
5. Add environment variables if needed
6. Click Deploy

### Update Backend URL

In `client/src/App.js`, update the API calls to your backend URL:

```javascript
// Instead of /api/health, use:
const response = await fetch('https://your-backend.com/api/health');
```

## Option 2: Heroku (For Backend)

### Deploy Backend to Heroku

1. Install Heroku CLI
2. Create Heroku account at [heroku.com](https://www.heroku.com)
3. In the `server/` directory:
   ```bash
   heroku login
   heroku create your-f1-api
   git push heroku main
   ```

4. Your backend will be available at `https://your-f1-api.herokuapp.com`

### Update Frontend Proxy

In `client/package.json`, update:
```json
{
  "proxy": "https://your-f1-api.herokuapp.com"
}
```

## Option 3: Railway.app

### Deploy Both Services

1. Connect GitHub repository to [railway.app](https://railway.app)
2. Create two services:
   - One for `server/`
   - One for `client/`
3. Set environment variables
4. Auto-deploys on git push

## Option 4: Docker (For Custom Hosting)

### Create Docker Compose Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
  
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Build and Run

```bash
docker-compose up -d
```

Visit `http://localhost:3000`

## Environment Configuration

Create `.env` files for production:

**server/.env**
```
PORT=5000
NODE_ENV=production
```

**client/.env.production**
```
REACT_APP_API_URL=https://your-backend.com
```

Then update `App.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || '/api';
const response = await fetch(`${API_URL}/health`);
```

## Production Checklist

- [ ] Update API URLs for production
- [ ] Set `NODE_ENV=production`
- [ ] Build frontend for production: `npm run build`
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and logging
- [ ] Configure CORS properly
- [ ] Test all API endpoints
- [ ] Verify data loads correctly
- [ ] Test mobile responsiveness
- [ ] Set up error tracking (Sentry, etc.)

## Performance Tips

1. **Frontend Optimization**
   - Build is already optimized by Create React App
   - Consider adding code splitting for components
   - Enable gzip compression on server

2. **Backend Optimization**
   - Add caching for API responses
   - Use Redis for session management
   - Implement API rate limiting

3. **Deployment Strategy**
   - Use CDN for static assets
   - Enable compression headers
   - Set appropriate cache headers

## Monitoring

### Backend Monitoring
- Use PM2 for process management
- Set up error logging with Winston or Morgan
- Monitor CPU/memory usage

### Frontend Monitoring
- Use Sentry for error tracking
- Google Analytics for usage metrics
- Performance monitoring tools

## Troubleshooting Deployments

**CORS Errors in Production**
```javascript
// In server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

**Static Files Not Loading**
- Ensure build files are served correctly
- Check file permissions
- Verify path configuration

**API Not Responding**
- Check backend service is running
- Verify environment variables
- Review firewall/network settings

## Rollback Procedure

1. Keep previous deployment version available
2. Switch to previous version if needed
3. Review error logs
4. Fix issues and redeploy

## Support & Maintenance

- Monitor logs regularly
- Update dependencies monthly
- Test new Ergast API data formats
- Backup important configurations

---

For detailed platform-specific guidance, refer to each service's documentation.
