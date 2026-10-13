# Installation Guide

This guide provides detailed step-by-step instructions for setting up the Urban Land & Infrastructure Management System on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify npm: `npm --version`
   - Or install yarn: `npm install -g yarn`

3. **MongoDB** (v5.0 or higher)
   - **Option 1 - Local Installation:**
     - Windows: Download from https://www.mongodb.com/try/download/community
     - macOS: `brew install mongodb-community`
     - Ubuntu: `sudo apt install mongodb`
   
   - **Option 2 - MongoDB Atlas (Cloud):**
     - Create account at https://www.mongodb.com/atlas
     - Create a free cluster
     - Get connection string

4. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

### Optional Tools

- **MongoDB Compass** (GUI for MongoDB)
- **Postman** (for API testing)
- **VS Code** (recommended code editor)

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd urban_land_project

# Or if you downloaded as ZIP, extract and navigate to the folder
```

### Step 2: Install Dependencies

```bash
# Install dependencies for all packages (recommended)
npm run install:all

# OR install individually
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### Step 3: Database Setup

#### Option A: Local MongoDB

1. **Start MongoDB Service**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is Running**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # You should see MongoDB connection successful
   # Type 'exit' to quit
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address
5. Get the connection string

### Step 4: Environment Configuration

1. **Copy Environment File**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Edit Environment Variables**
   ```bash
   # Open the .env file in your preferred editor
   nano backend/.env
   # or
   code backend/.env
   ```

3. **Configure Variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   # For Local MongoDB:
   MONGO_URI=mongodb://localhost:27017/urban_land_db
   
   # For MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/urban_land_db
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=7d
   
   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

### Step 5: Start the Application

#### Method 1: Using Root Scripts (Recommended)

```bash
# Terminal 1 - Start Backend
npm run backend

# Terminal 2 - Start Frontend
npm run frontend
```

#### Method 2: Individual Startup

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 6: Verify Installation

1. **Check Backend**
   - Open: http://localhost:5000/api/health
   - Should see: `{"status":"ok","message":"Urban Land API is running"}`

2. **Check Frontend**
   - Open: http://localhost:5173
   - Should see the login page

3. **Test Login**
   - Use demo credentials:
     - **Officer**: biruk.officer@gov.et / birukb0322
     - **Citizen**: abebe@example.com / citizen123

## 🔧 Development Setup

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "mongodb.mongodb-vscode",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "html"
  }
}
```

## 🐛 Troubleshooting

### Common Installation Issues

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Use Node Version Manager (nvm) for easy switching
```

#### 2. MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS/Linux
brew services list | grep mongodb
# or
sudo systemctl status mongod
```

**Solutions:**
- Ensure MongoDB service is started
- Check firewall settings
- Verify connection string in .env file

#### 3. Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux

# Or use npx kill-port
npx kill-port 5000
npx kill-port 5173
```

#### 4. npm Install Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with different registry
npm install --registry https://registry.npmjs.org/
```

#### 5. Permission Issues (Linux/macOS)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm to avoid permission issues
```

### Environment-Specific Issues

#### Windows
- Use Git Bash or PowerShell (not Command Prompt)
- Ensure Windows Defender doesn't block MongoDB
- Run terminals as Administrator if needed

#### macOS
- Install Xcode Command Line Tools: `xcode-select --install`
- Use Homebrew for package management
- Check macOS firewall settings

#### Linux
- Install build essentials: `sudo apt-get install build-essential`
- Ensure proper permissions for MongoDB data directory
- Check SELinux settings if applicable

## 📊 Database Seeding (Optional)

If you want to populate the database with sample data:

```bash
# Run the seed script
cd backend
npm run seed

# This will create:
# - Sample users (citizens and officers)
# - Sample land requests
# - Sample infrastructure reports
```

## 🔒 Security Setup

### JWT Secret Generation
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Security (Production)
```javascript
// Enable authentication in MongoDB
use admin
db.createUser({
  user: "admin",
  pwd: "securepassword",
  roles: ["userAdminAnyDatabase"]
})
```

## 🚀 Production Deployment Preparation

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# The build files will be in frontend/dist/
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/urban_land_db
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://yourdomain.com
```

## 📝 Next Steps

After successful installation:

1. **Explore the Application**
   - Login with different user roles
   - Test all features
   - Check the dashboard and reports

2. **Development Workflow**
   - Make changes to the code
   - Both servers support hot reload
   - Test your changes immediately

3. **Database Management**
   - Use MongoDB Compass for GUI access
   - Monitor database collections
   - Backup important data

4. **API Testing**
   - Use Postman to test API endpoints
   - Check the API documentation
   - Test authentication flows

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main README.md
3. Check the GitHub issues
4. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

---

**Happy coding! 🎉**