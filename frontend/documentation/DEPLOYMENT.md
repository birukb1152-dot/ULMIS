# Deployment Guide

This guide covers deploying the Urban Land & Infrastructure Management System to production environments.

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Static)      │    │   (Node.js)     │    │   (MongoDB)     │
│   CDN/Nginx     │◄──►│   PM2/Docker    │◄──►│   Atlas/Self    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Deployment Options

### Option 1: Cloud Platforms (Recommended)
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Heroku, Railway, Render
- **Database**: MongoDB Atlas

### Option 2: VPS/Dedicated Server
- **Server**: DigitalOcean, Linode, AWS EC2
- **Web Server**: Nginx + PM2
- **Database**: Self-hosted MongoDB or Atlas

### Option 3: Containerized (Docker)
- **Container**: Docker + Docker Compose
- **Orchestration**: Kubernetes (optional)
- **Registry**: Docker Hub, AWS ECR

## 🌐 Frontend Deployment

### Vercel Deployment (Recommended)

1. **Prepare the Build**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

3. **Environment Variables**
   ```bash
   # Set in Vercel dashboard
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Netlify Deployment

1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     base = "frontend/"
     publish = "frontend/dist"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

### AWS S3 + CloudFront

1. **Build and Upload**
   ```bash
   cd frontend
   npm run build
   
   # Upload to S3
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

2. **CloudFront Configuration**
   ```json
   {
     "Origins": [{
       "DomainName": "your-bucket.s3.amazonaws.com",
       "Id": "S3-your-bucket",
       "S3OriginConfig": {
         "OriginAccessIdentity": ""
       }
     }],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-your-bucket",
       "ViewerProtocolPolicy": "redirect-to-https"
     }
   }
   ```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        root /var/www/urban-land/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🖥️ Backend Deployment

### Heroku Deployment

1. **Prepare for Heroku**
   ```bash
   # Create Procfile
   echo "web: node src/server.js" > backend/Procfile
   
   # Update package.json
   cd backend
   npm install --save-dev @babel/core @babel/preset-env
   ```

2. **Deploy**
   ```bash
   # Install Heroku CLI
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

### Railway Deployment

1. **Connect Repository**
   - Connect your GitHub repository
   - Select the backend folder as root

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=$PORT
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   JWT_SECRET=your-jwt-secret
   CLIENT_URL=https://your-frontend-url.com
   ```

### DigitalOcean Droplet

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd urban_land_project/backend
   
   # Install dependencies
   npm install --production
   
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'urban-land-api',
       script: 'src/server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       }
     }]
   }
   EOF
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Docker Deployment

1. **Backend Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Create non-root user
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001
   USER nodejs
   
   EXPOSE 5000
   
   CMD ["node", "src/server.js"]
   ```

2. **Frontend Dockerfile**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine AS builder
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Docker Compose**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   
   services:
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
   
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGO_URI=mongodb://mongo:27017/urban_land_db
         - JWT_SECRET=your-jwt-secret
       depends_on:
         - mongo
   
     mongo:
       image: mongo:5
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
       environment:
         - MONGO_INITDB_ROOT_USERNAME=admin
         - MONGO_INITDB_ROOT_PASSWORD=password
   
   volumes:
     mongo_data:
   ```

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at https://www.mongodb.com/atlas
   - Create a free cluster
   - Choose your preferred region

2. **Configure Access**
   ```bash
   # Whitelist IP addresses
   # Create database user
   # Get connection string
   ```

3. **Connection String**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/urban_land_db?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Configure MongoDB**
   ```bash
   # Edit configuration
   sudo nano /etc/mongod.conf
   
   # Enable authentication
   security:
     authorization: enabled
   
   # Start service
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Create Admin User**
   ```javascript
   // Connect to MongoDB shell
   mongosh
   
   // Create admin user
   use admin
   db.createUser({
     user: "admin",
     pwd: "securepassword",
     roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
   })
   
   // Create application user
   use urban_land_db
   db.createUser({
     user: "app_user",
     pwd: "app_password",
     roles: ["readWrite"]
   })
   ```

## 🔒 Security Configuration

### SSL/TLS Certificate

1. **Let's Encrypt (Free)**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get certificate
   sudo certbot --nginx -d your-domain.com
   
   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

2. **Nginx SSL Configuration**
   ```nginx
   ssl_protocols TLSv1.2 TLSv1.3;
   ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
   ssl_prefer_server_ciphers off;
   ssl_session_cache shared:SSL:10m;
   ssl_session_timeout 10m;
   ```

### Environment Variables

```bash
# Production environment variables
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/urban_land_db
JWT_SECRET=super-long-random-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-domain.com

# Optional: Additional security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Specific application ports
sudo ufw allow 5000  # Backend (if not behind proxy)
sudo ufw allow 27017 # MongoDB (if external access needed)
```

## 📊 Monitoring and Logging

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart urban-land-api

# Zero-downtime deployment
pm2 reload urban-land-api
```

### Log Management

```javascript
// backend/src/middleware/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Health Checks

```javascript
// backend/src/routes/health.js
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-backend-app"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 🚀 Performance Optimization

### Backend Optimization

```javascript
// Compression middleware
const compression = require('compression');
app.use(compression());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Caching
const redis = require('redis');
const client = redis.createClient();

// Database indexing
// In your MongoDB collections, create indexes:
db.landRequests.createIndex({ "citizenId": 1, "status": 1 });
db.infraReports.createIndex({ "citizenId": 1, "status": 1 });
db.users.createIndex({ "email": 1 }, { unique: true });
```

### Frontend Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          maps: ['leaflet', 'react-leaflet']
        }
      }
    }
  }
});
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Run all tests
- [ ] Update environment variables
- [ ] Build frontend for production
- [ ] Database migrations (if any)
- [ ] Security audit
- [ ] Performance testing

### Deployment
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure DNS
- [ ] Set up SSL certificate
- [ ] Configure monitoring
- [ ] Test all endpoints

### Post-Deployment
- [ ] Verify application functionality
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Set up backups
- [ ] Document deployment process
- [ ] Update team on deployment

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```javascript
   // Ensure CLIENT_URL is set correctly
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB connection string
   # Verify network access
   # Check authentication credentials
   ```

3. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **SSL Certificate Issues**
   ```bash
   # Renew Let's Encrypt certificate
   sudo certbot renew
   
   # Check certificate status
   sudo certbot certificates
   ```

### Rollback Strategy

```bash
# PM2 rollback
pm2 stop urban-land-api
git checkout previous-stable-commit
npm install
pm2 start urban-land-api

# Docker rollback
docker-compose down
docker-compose up -d --scale backend=0
docker-compose up -d previous-image-tag
```

---

**For additional support, refer to the main README.md and API documentation.**