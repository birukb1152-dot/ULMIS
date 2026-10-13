# API Documentation

This document provides comprehensive information about the Urban Land & Infrastructure Management System REST API endpoints.

## 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow
1. Register or login to receive a JWT token
2. Include the token in subsequent requests
3. Token expires after 7 days (configurable)

## 📋 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 🔑 Authentication Endpoints

### Register New User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "nationalId": "123456789",
  "phoneNumber": "0911000000",
  "email": "john@example.com",
  "address": "Addis Ababa, Bole",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "citizen"
    },
    "token": "jwt_token_here"
  }
}
```

**Validation Rules:**
- `fullName`: Required, min 2 characters
- `nationalId`: Required, 8-12 digits, unique
- `phoneNumber`: Required, 10 digits
- `email`: Required, valid email format, unique
- `address`: Required, min 5 characters
- `password`: Required, min 6 characters

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "citizen"
    },
    "token": "jwt_token_here"
  }
}
```

### Get User Profile
```http
GET /api/auth/profile
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "citizen",
      "nationalId": "123456789",
      "phoneNumber": "0911000000",
      "address": "Addis Ababa, Bole",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## 🏞️ Land Request Endpoints

### Get Land Requests
```http
GET /api/land-requests
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (Pending, Under Review, Approved, Rejected)
- `landType`: Filter by type (Residential, Commercial, Agricultural, Industrial)
- `citizenId`: Filter by citizen (officer only)

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "LR-001",
        "citizenId": "user_id",
        "citizenName": "John Doe",
        "landType": "Residential",
        "size": "500 sqm",
        "location": "Bole Sub-city, Addis Ababa",
        "purpose": "Build family home",
        "applicationDate": "2024-03-01",
        "status": "Pending",
        "landId": null,
        "officerNote": "",
        "updatedAt": "2024-03-01"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Submit Land Request
```http
POST /api/land-requests
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "landType": "Residential",
  "size": "500 sqm",
  "location": "Bole Sub-city, Addis Ababa",
  "purpose": "Build family home"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "LR-002",
      "citizenId": "user_id",
      "citizenName": "John Doe",
      "landType": "Residential",
      "size": "500 sqm",
      "location": "Bole Sub-city, Addis Ababa",
      "purpose": "Build family home",
      "applicationDate": "2024-03-01",
      "status": "Pending",
      "landId": null,
      "officerNote": "",
      "updatedAt": "2024-03-01"
    }
  }
}
```

### Update Land Request (Officer Only)
```http
PUT /api/land-requests/:id
```

**Headers:**
```http
Authorization: Bearer <officer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Approved",
  "landId": "LAND-AA-001",
  "officerNote": "All documents verified and approved."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "LR-001",
      "status": "Approved",
      "landId": "LAND-AA-001",
      "officerNote": "All documents verified and approved.",
      "updatedAt": "2024-03-15"
    }
  }
}
```

### Delete Land Request
```http
DELETE /api/land-requests/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Land request deleted successfully"
}
```

## 🚧 Infrastructure Report Endpoints

### Get Infrastructure Reports
```http
GET /api/infra-reports
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (Pending, In Progress, Resolved)
- `issueType`: Filter by type (Road Damage, Water Supply, Street Light, Sewage, Other)
- `citizenId`: Filter by citizen (officer only)

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "IR-001",
        "citizenId": "user_id",
        "citizenName": "John Doe",
        "issueType": "Road Damage",
        "location": "Bole Road, near Edna Mall",
        "description": "Large pothole causing traffic hazard",
        "reportDate": "2024-04-01",
        "status": "Pending",
        "officerNote": "",
        "updatedAt": "2024-04-01"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Submit Infrastructure Report
```http
POST /api/infra-reports
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "issueType": "Road Damage",
  "location": "Bole Road, near Edna Mall",
  "description": "Large pothole causing traffic hazard"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "IR-002",
      "citizenId": "user_id",
      "citizenName": "John Doe",
      "issueType": "Road Damage",
      "location": "Bole Road, near Edna Mall",
      "description": "Large pothole causing traffic hazard",
      "reportDate": "2024-04-01",
      "status": "Pending",
      "officerNote": "",
      "updatedAt": "2024-04-01"
    }
  }
}
```

### Update Infrastructure Report (Officer Only)
```http
PUT /api/infra-reports/:id
```

**Headers:**
```http
Authorization: Bearer <officer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Resolved",
  "officerNote": "Pothole repaired on 2024-04-10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "IR-001",
      "status": "Resolved",
      "officerNote": "Pothole repaired on 2024-04-10",
      "updatedAt": "2024-04-10"
    }
  }
}
```

## 👥 User Management Endpoints (Officer Only)

### Get All Users
```http
GET /api/users
```

**Headers:**
```http
Authorization: Bearer <officer_token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role (citizen, officer)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "citizen",
        "nationalId": "123456789",
        "phoneNumber": "0911000000",
        "address": "Addis Ababa, Bole",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100
    }
  }
}
```

### Add New Officer
```http
POST /api/users/officers
```

**Headers:**
```http
Authorization: Bearer <officer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "nationalId": "987654321",
  "phoneNumber": "0911000001",
  "email": "jane.officer@gov.et",
  "address": "Addis Ababa, Kirkos",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "officer": {
      "id": "officer_id",
      "fullName": "Jane Smith",
      "email": "jane.officer@gov.et",
      "role": "officer",
      "createdAt": "2024-03-01T00:00:00.000Z"
    }
  }
}
```

### Remove Officer
```http
DELETE /api/users/officers/:id
```

**Headers:**
```http
Authorization: Bearer <officer_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Officer removed successfully"
}
```

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
```http
GET /api/dashboard/stats
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (Officer):**
```json
{
  "success": true,
  "data": {
    "totalLand": 150,
    "pendingLand": 25,
    "approvedLand": 100,
    "rejectedLand": 25,
    "totalInfra": 75,
    "pendingInfra": 15,
    "resolvedInfra": 50,
    "totalUsers": 200,
    "landByType": [
      { "_id": "Residential", "count": 80 },
      { "_id": "Commercial", "count": 40 },
      { "_id": "Agricultural", "count": 20 },
      { "_id": "Industrial", "count": 10 }
    ],
    "landByStatus": [
      { "_id": "Approved", "count": 100 },
      { "_id": "Pending", "count": 25 },
      { "_id": "Under Review", "count": 15 },
      { "_id": "Rejected", "count": 10 }
    ],
    "recentLand": [
      {
        "_id": "request_id",
        "requestId": "LR-001",
        "location": "Bole Sub-city",
        "landType": "Residential",
        "status": "Approved",
        "applicationDate": "2024-03-01"
      }
    ],
    "recentActivity": [
      {
        "type": "land",
        "text": "Land request LR-001 approved",
        "time": "2024-03-15"
      }
    ]
  }
}
```

**Response (Citizen):**
```json
{
  "success": true,
  "data": {
    "myLand": 3,
    "myPending": 1,
    "myApproved": 2,
    "myRejected": 0,
    "myInfra": 2,
    "myInfraPending": 1,
    "myInfraResolved": 1,
    "recentLand": [
      {
        "_id": "request_id",
        "requestId": "LR-001",
        "location": "Bole Sub-city",
        "landType": "Residential",
        "status": "Approved",
        "applicationDate": "2024-03-01"
      }
    ],
    "recentActivity": [
      {
        "type": "land",
        "text": "Your land request LR-001 approved",
        "time": "2024-03-15"
      }
    ]
  }
}
```

## 📈 Reports Endpoints

### Get Analytics Data
```http
GET /api/reports/analytics
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLand": 150,
    "approvedLand": 100,
    "totalInfra": 75,
    "resolvedInfra": 50,
    "landByType": [
      { "_id": "Residential", "count": 80 },
      { "_id": "Commercial", "count": 40 }
    ],
    "landByStatus": [
      { "_id": "Approved", "count": 100 },
      { "_id": "Pending", "count": 25 }
    ],
    "infraByType": [
      { "_id": "Road Damage", "count": 30 },
      { "_id": "Water Supply", "count": 20 }
    ],
    "infraByStatus": [
      { "_id": "Resolved", "count": 50 },
      { "_id": "Pending", "count": 15 }
    ],
    "monthlyTrend": [
      { "month": "Jan", "land": 10, "infra": 5 },
      { "month": "Feb", "land": 15, "infra": 8 }
    ]
  }
}
```

### Export Land Requests to CSV
```http
GET /api/reports/export/land
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)

**Response:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="land-requests.csv"

ID,Citizen Name,Land Type,Size,Location,Purpose,Status,Application Date,Updated At
LR-001,John Doe,Residential,500 sqm,Bole Sub-city,Build family home,Approved,2024-03-01,2024-03-15
```

### Export Infrastructure Reports to CSV
```http
GET /api/reports/export/infra
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)

**Response:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="infrastructure-reports.csv"

ID,Citizen Name,Issue Type,Location,Description,Status,Report Date,Updated At
IR-001,John Doe,Road Damage,Bole Road,Large pothole,Resolved,2024-04-01,2024-04-10
```

## ❌ Error Codes

### Authentication Errors
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Token invalid
- `AUTH_004`: Access denied

### Validation Errors
- `VAL_001`: Required field missing
- `VAL_002`: Invalid email format
- `VAL_003`: Password too short
- `VAL_004`: Invalid phone number
- `VAL_005`: Duplicate entry

### Resource Errors
- `RES_001`: Resource not found
- `RES_002`: Resource already exists
- `RES_003`: Cannot delete resource
- `RES_004`: Permission denied

### Server Errors
- `SRV_001`: Internal server error
- `SRV_002`: Database connection error
- `SRV_003`: Service unavailable

## 📝 Rate Limiting

API requests are limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Export endpoints**: 10 requests per minute

## 🔒 Security Headers

All API responses include security headers:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 📚 SDK and Libraries

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Get land requests
curl -X GET http://localhost:5000/api/land-requests \
  -H "Authorization: Bearer YOUR_TOKEN"

# Submit land request
curl -X POST http://localhost:5000/api/land-requests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"landType":"Residential","size":"500 sqm","location":"Bole","purpose":"Home"}'
```

## 🧪 Testing

### Postman Collection
Import the provided Postman collection for easy API testing:
- Authentication flows
- CRUD operations
- Error scenarios
- Edge cases

### Test Data
Use the following test accounts:
- **Officer**: biruk.officer@gov.et / birukb0322
- **Citizen**: abebe@example.com / citizen123

---

**For more information, refer to the main README.md file.**