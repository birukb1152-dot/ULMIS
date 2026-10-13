# Urban Land & Infrastructure Management System

A comprehensive web-based platform for managing land allocation, property registration, and infrastructure issue reporting in urban areas. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🏗️ Project Overview

This system serves as a digital platform for government municipalities to manage land requests and infrastructure reporting efficiently. It provides separate interfaces for citizens and municipal officers with role-based access control.

### Key Features

- **🏛️ Dual Role System**: Separate interfaces for Citizens and Municipal Officers
- **📋 Land Request Management**: Submit, track, and manage land allocation requests
- **🚧 Infrastructure Reporting**: Report and track infrastructure issues
- **📊 Analytics Dashboard**: Real-time statistics and data visualization
- **🗺️ Interactive Map View**: Visual representation of land parcels
- **👥 User Management**: Officer can manage citizens and other officers
- **📈 Comprehensive Reports**: Generate and export detailed reports
- **🌙 Dark/Light Mode**: User preference-based theme switching
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 19.2.5 with Hooks and Context API
- Vite 8.0.10 for build tooling
- Tailwind CSS 4.2.4 for styling
- React Router DOM 7.14.2 for navigation
- Recharts 3.8.1 for data visualization
- React Leaflet 5.0.0 for interactive maps
- Lucide React 1.14.0 for icons
- Axios 1.15.2 for HTTP requests

**Backend:**
- Node.js with Express.js 4.19.2
- MongoDB 8.4.1 with Mongoose ODM
- JWT authentication with bcryptjs
- CORS enabled for cross-origin requests
- Morgan for HTTP request logging
- Express Validator for input validation

## 📁 Project Structure

```
urban_land_project/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/
│   │   ├── 📁 api/             # API configuration
│   │   ├── 📁 components/      # Reusable UI components
│   │   │   ├── 📁 layout/      # Layout components
│   │   │   └── 📁 ui/          # UI components
│   │   ├── 📁 context/         # React Context providers
│   │   ├── 📁 pages/           # Page components
│   │   │   ├── 📁 auth/        # Authentication pages
│   │   │   ├── 📁 citizen/     # Citizen-specific pages
│   │   │   └── 📁 officer/     # Officer-specific pages
│   │   └── 📁 assets/          # Images and static files
│   ├── package.json
│   └── vite.config.js
├── 📁 backend/                  # Express.js backend API
│   ├── 📁 src/
│   │   ├── 📁 config/          # Database and app configuration
│   │   ├── 📁 controllers/     # Route controllers
│   │   ├── 📁 middleware/      # Custom middleware
│   │   ├── 📁 models/          # MongoDB models
│   │   ├── 📁 routes/          # API routes
│   │   └── server.js           # Main server file
│   ├── .env                    # Environment variables
│   └── package.json
├── 📁 land-registry/           # Additional frontend instance
└── package.json                # Root package.json
```

## 📚 Documentation

- **[📖 Installation Guide](INSTALLATION.md)** - Detailed setup instructions
- **[🔌 API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[🚀 Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[🤝 Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[🔒 Security Policy](SECURITY.md)** - Security guidelines and reporting
- **[📋 Project Overview](PROJECT_OVERVIEW.md)** - Comprehensive project details
- **[📝 Changelog](CHANGELOG.md)** - Version history and changes
- **[⚖️ License](LICENSE)** - MIT License details

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urban_land_project
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/.env.example backend/.env
   
   # Edit the .env file with your configuration
   nano backend/.env
   ```

4. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Start the development servers**
   
   **Option 1: Start both servers simultaneously**
   ```bash
   # Terminal 1 - Backend
   npm run backend
   
   # Terminal 2 - Frontend
   npm run frontend
   ```
   
   **Option 2: Start individually**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 User Roles & Access

### 🏛️ Municipal Officer (Admin)
**Login Credentials:**
- Email: `biruk.officer@gov.et`
- Password: `birukb0322`

**Capabilities:**
- View all land requests from all citizens
- Approve/reject land applications
- Manage infrastructure reports
- Add/remove other officers
- View comprehensive analytics
- Export reports to CSV
- Manage user accounts

**Available Pages:**
- Dashboard (system-wide statistics)
- Map View (all land parcels)
- Land Applications (manage all requests)
- Infrastructure Reports (manage all reports)
- Users & Officers (user management)
- Reports (system analytics)
- Settings (profile management)

### 👤 Citizen (User)
**Login Credentials:**
- Email: `abebe@example.com` | Password: `citizen123`
- Email: `tigist@example.com` | Password: `citizen456`

**Capabilities:**
- Submit land allocation requests
- Track personal request status
- Report infrastructure issues
- View personal analytics
- Update profile information

**Available Pages:**
- Dashboard (personal statistics)
- Map View (view land parcels)
- Land Requests (personal requests)
- Infrastructure Reports (personal reports)
- Reports (personal analytics)
- Settings (profile management)

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  nationalId: String (unique),
  phoneNumber: String,
  email: String (unique),
  address: String,
  password: String (hashed),
  role: String (enum: ['citizen', 'officer']),
  isSuperAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Land Requests Collection
```javascript
{
  _id: ObjectId,
  requestId: String (unique),
  citizenId: ObjectId (ref: User),
  citizenName: String,
  landType: String (enum: ['Residential', 'Commercial', 'Agricultural', 'Industrial']),
  size: String,
  location: String,
  purpose: String,
  applicationDate: Date,
  status: String (enum: ['Pending', 'Under Review', 'Approved', 'Rejected']),
  landId: String,
  officerNote: String,
  updatedAt: Date
}
```

### Infrastructure Reports Collection
```javascript
{
  _id: ObjectId,
  reportId: String (unique),
  citizenId: ObjectId (ref: User),
  citizenName: String,
  issueType: String (enum: ['Road Damage', 'Water Supply', 'Street Light', 'Sewage', 'Other']),
  location: String,
  description: String,
  reportDate: Date,
  status: String (enum: ['Pending', 'In Progress', 'Resolved']),
  officerNote: String,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new citizen
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)

### Land Request Routes (`/api/land-requests`)
- `GET /` - Get land requests (filtered by role)
- `POST /` - Submit new land request (citizen only)
- `PUT /:id` - Update land request (officer only)
- `DELETE /:id` - Delete land request

### Infrastructure Routes (`/api/infra-reports`)
- `GET /` - Get infrastructure reports (filtered by role)
- `POST /` - Submit new infrastructure report (citizen only)
- `PUT /:id` - Update infrastructure report (officer only)
- `DELETE /:id` - Delete infrastructure report

### User Management Routes (`/api/users`)
- `GET /` - Get all users (officer only)
- `POST /officers` - Add new officer (officer only)
- `DELETE /officers/:id` - Remove officer (officer only)

### Dashboard Routes (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics

### Reports Routes (`/api/reports`)
- `GET /analytics` - Get analytics data
- `GET /export/land` - Export land requests to CSV
- `GET /export/infra` - Export infrastructure reports to CSV

## 🎨 UI Components

### Layout Components
- **Layout**: Main application layout with sidebar and topbar
- **Sidebar**: Navigation sidebar with role-based menu items
- **Topbar**: Top navigation bar with user info and notifications

### UI Components
- **Button**: Customizable button component with variants
- **FormField**: Form input wrapper with validation
- **KpiCard**: Key Performance Indicator display card
- **Modal**: Reusable modal dialog component
- **PageHeader**: Consistent page header with title and subtitle
- **StatusBadge**: Status indicator with color coding
- **Table**: Data table with sorting and pagination

## 📊 Features Deep Dive

### Dashboard Analytics
- **KPI Cards**: Real-time statistics display
- **Charts**: Interactive bar charts and pie charts using Recharts
- **Recent Activity**: Timeline of recent actions
- **Data Tables**: Sortable and filterable data displays

### Map Integration
- **Interactive Maps**: Powered by React Leaflet
- **Land Parcel Visualization**: Color-coded markers based on status
- **Filtering**: Filter by status, type, and search by ID
- **Popup Details**: Detailed information on marker click

### Authentication System
- **Context-based Authentication**: React Context for state management
- **Local Storage Persistence**: Session persistence across browser refreshes
- **Role-based Access Control**: Different interfaces for different user roles
- **Protected Routes**: Route protection based on authentication status

### Data Management
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Real-time Updates**: Immediate UI updates on data changes
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## 🔧 Configuration

### Environment Variables (Backend)
```env
PORT=5000                                    # Server port
MONGO_URI=mongodb://localhost:27017/urban_land_db  # MongoDB connection string
JWT_SECRET=your_jwt_secret_here             # JWT signing secret
JWT_EXPIRES_IN=7d                           # JWT expiration time
NODE_ENV=development                        # Environment mode
CLIENT_URL=http://localhost:5173            # Frontend URL for CORS
```

### Frontend Configuration
- **Vite Config**: Modern build tool configuration
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting and formatting rules

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Register new citizen account
   - Login with different user roles
   - Test protected route access

2. **Land Request Workflow**
   - Submit land request as citizen
   - Review and approve as officer
   - Track status changes

3. **Infrastructure Reporting**
   - Report infrastructure issue
   - Update status as officer
   - Verify notifications

### Test Data
The system includes seed data for testing:
- 2 Citizens with sample land requests
- 1 Super Admin officer
- Sample infrastructure reports
- Various request statuses and types

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
NODE_ENV=production npm start
```

### Environment Setup
1. Set up production MongoDB instance
2. Configure environment variables for production
3. Set up reverse proxy (nginx) for serving static files
4. Configure SSL certificates for HTTPS

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, or DigitalOcean
- **Database**: MongoDB Atlas or self-hosted MongoDB

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation using express-validator
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Environment Variables**: Sensitive data stored in environment variables

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Solution: Ensure MongoDB is running and connection string is correct
   ```

2. **Port Already in Use**
   ```bash
   # Kill process using port 5000
   npx kill-port 5000
   
   # Kill process using port 5173
   npx kill-port 5173
   ```

3. **Authentication Issues**
   ```
   Solution: Clear localStorage and login again
   ```

4. **Charts Not Displaying**
   ```
   Solution: Ensure user has data (land requests) to display
   ```

## 📈 Future Enhancements

- **Mobile App**: React Native mobile application
- **Real-time Notifications**: WebSocket-based notifications
- **Document Upload**: File upload for supporting documents
- **Payment Integration**: Online payment for land fees
- **GIS Integration**: Advanced Geographic Information System features
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Analytics**: Machine learning-based insights
- **API Rate Limiting**: Enhanced security measures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Additional Resources

- **[📖 Installation Guide](INSTALLATION.md)** - Step-by-step setup instructions
- **[🔌 API Documentation](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[🚀 Deployment Guide](DEPLOYMENT.md)** - Production deployment strategies
- **[🤝 Contributing Guide](CONTRIBUTING.md)** - Guidelines for contributors
- **[🔒 Security Policy](SECURITY.md)** - Security guidelines and vulnerability reporting
- **[📋 Project Overview](PROJECT_OVERVIEW.md)** - Detailed project information and roadmap
- **[📝 Changelog](CHANGELOG.md)** - Version history and release notes

## 👨‍💻 Development Team

- **Backend Development**: Node.js, Express.js, MongoDB
- **Frontend Development**: React, Tailwind CSS, Vite
- **UI/UX Design**: Modern, responsive design principles
- **Database Design**: Efficient schema design and relationships

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section

---

**Built with ❤️ for efficient urban land management**