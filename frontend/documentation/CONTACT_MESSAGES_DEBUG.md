# Contact Messages Debugging Guide

## Issue
Contact form submissions from the landing page are successful, but messages don't appear on the officer messages page.

## System Architecture

### Frontend (Landing Page)
- **File**: `frontend/src/pages/LandingPage.jsx`
- **Endpoint**: `POST ${API_URL}/contact/submit`
- **Method**: Public (no authentication required)
- **Data Sent**:
  ```javascript
  {
    name: string,
    email: string,
    phone: string (optional),
    subject: string,
    message: string
  }
  ```

### Backend
- **Controller**: `backend/src/controllers/contactController.js`
- **Routes**: `backend/src/routes/contactRoutes.js`
- **Model**: `backend/src/models/ContactMessage.js`
- **Public Endpoint**: `POST /api/contact/submit`
- **Protected Endpoints**: 
  - `GET /api/contact` - Get all messages (officer only)
  - `GET /api/contact/stats` - Get statistics (officer only)
  - `GET /api/contact/:id` - Get single message (officer only)

### Frontend (Officer Page)
- **File**: `frontend/src/pages/officer/OfficerMessagesPage.jsx`
- **Endpoint**: `GET ${API_URL}/contact`
- **Method**: Protected (requires authentication token)

## Debugging Steps

### 1. Check Backend Server Status
```bash
cd backend
npm run dev
```
- Verify server is running on port 5001 (or configured port)
- Check console for any errors

### 2. Check Database Connection
- Verify MongoDB is running
- Check `.env` file has correct `MONGODB_URI`
- Look for connection success message in server console

### 3. Test Contact Form Submission

#### Using Browser Console (Landing Page)
1. Open landing page
2. Open browser DevTools (F12)
3. Go to Network tab
4. Submit contact form
5. Check the request:
   - **URL**: Should be `http://localhost:5001/api/contact/submit`
   - **Status**: Should be `201 Created`
   - **Response**: Should contain success message

#### Using curl
```bash
curl -X POST http://localhost:5001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "0911000000",
    "subject": "Test Subject",
    "message": "This is a test message"
  }'
```

Expected response:
```json
{
  "message": "Your message has been sent successfully! We will get back to you soon.",
  "messageId": "..."
}
```

### 4. Verify Messages in Database

#### Using MongoDB Compass or mongo shell
```javascript
// Connect to your database
use your_database_name

// Check if messages exist
db.contactmessages.find().pretty()

// Count messages
db.contactmessages.countDocuments()
```

### 5. Test Officer Messages Page

#### Check Authentication
1. Login as officer (biruk.officer@gov.et / birukb0322)
2. Navigate to Contact Messages page
3. Open browser DevTools (F12)
4. Go to Network tab
5. Check the request:
   - **URL**: Should be `http://localhost:5001/api/contact?page=1&limit=10`
   - **Headers**: Should include `Authorization: Bearer <token>`
   - **Status**: Should be `200 OK`
   - **Response**: Should contain messages array

#### Check Token
```javascript
// In browser console
localStorage.getItem('token')
```
- Should return a JWT token
- If null, authentication failed

### 6. Common Issues & Solutions

#### Issue 1: CORS Error
**Symptom**: Browser console shows CORS error
**Solution**: Check `backend/src/server.js` has CORS enabled:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
```

#### Issue 2: Wrong API URL
**Symptom**: 404 Not Found errors
**Solution**: 
- Check `frontend/.env` has correct `VITE_API_URL`
- Should be: `VITE_API_URL=http://localhost:5001/api`

#### Issue 3: Authentication Token Missing
**Symptom**: 401 Unauthorized on officer page
**Solution**:
- Login again as officer
- Check token is stored in localStorage
- Verify token is sent in Authorization header

#### Issue 4: Database Not Connected
**Symptom**: 500 Internal Server Error
**Solution**:
- Check MongoDB is running
- Verify `MONGODB_URI` in `backend/.env`
- Check server console for connection errors

#### Issue 5: Messages Not Saved
**Symptom**: 201 response but no messages in database
**Solution**:
- Check ContactMessage model is properly defined
- Verify database name is correct
- Check for validation errors in server console

### 7. Manual Test Script

Create a test file `backend/test-contact.js`:
```javascript
import mongoose from 'mongoose';
import ContactMessage from './src/models/ContactMessage.js';
import dotenv from 'dotenv';

dotenv.config();

async function testContact() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create test message
    const message = new ContactMessage({
      name: 'Test User',
      email: 'test@example.com',
      phone: '0911000000',
      subject: 'Test Subject',
      message: 'This is a test message'
    });

    await message.save();
    console.log('✅ Message saved:', message._id);

    // Fetch all messages
    const messages = await ContactMessage.find();
    console.log(`✅ Total messages in database: ${messages.length}`);
    console.log('Messages:', messages);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testContact();
```

Run it:
```bash
cd backend
node test-contact.js
```

### 8. Check Environment Variables

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001/api
```

#### Backend `.env`
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/urban-land-management
JWT_SECRET=your-secret-key
```

### 9. Verify Server Routes

Check server console on startup should show:
```
✅ MongoDB Connected
✅ Server running on port 5001
```

Test routes manually:
```bash
# Test public endpoint
curl http://localhost:5001/api/contact/submit

# Test protected endpoint (should return 401)
curl http://localhost:5001/api/contact

# Test with token
curl http://localhost:5001/api/contact \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Quick Fix Checklist

- [ ] Backend server is running on correct port
- [ ] MongoDB is connected
- [ ] Frontend `.env` has correct API URL
- [ ] Contact form submits successfully (201 response)
- [ ] Messages are saved in database (verify with MongoDB)
- [ ] Officer is logged in (token in localStorage)
- [ ] Officer messages page sends correct request with token
- [ ] No CORS errors in browser console
- [ ] No errors in backend server console

## Expected Flow

1. **User submits form** → POST /api/contact/submit → 201 Created
2. **Message saved** → MongoDB contactmessages collection
3. **Officer logs in** → POST /api/auth/login → Token received
4. **Officer opens messages page** → GET /api/contact → Messages displayed

## Still Not Working?

If messages still don't appear after checking all above:

1. **Clear browser cache and localStorage**
2. **Restart both frontend and backend servers**
3. **Check MongoDB is running**: `mongosh` or MongoDB Compass
4. **Verify database name matches** in both connection string and queries
5. **Check server logs** for any errors during message fetch
6. **Test with Postman** to isolate frontend vs backend issues
