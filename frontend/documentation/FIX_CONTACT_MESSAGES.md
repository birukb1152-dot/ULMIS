# Fix Contact Messages Not Showing

## Quick Diagnosis

The contact form on the landing page submits successfully, but messages don't appear on the officer messages page. This is likely due to one of these issues:

1. **Backend server not running**
2. **Database not connected**
3. **Messages not being saved**
4. **Authentication issue on officer page**

## Step-by-Step Fix

### Step 1: Verify Backend Server is Running

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected
✅ Server running on port 5001
```

If you see errors, check:
- MongoDB is running
- `.env` file exists with correct `MONGODB_URI`

### Step 2: Verify Messages in Database

Run the verification script:

```bash
cd backend
node verify-contact-messages.js
```

This will:
- Connect to MongoDB
- Count total messages
- Show recent messages
- Create a test message if none exist

**If you see "No messages found":**
- The contact form submissions aren't reaching the database
- Continue to Step 3

**If you see messages:**
- Messages are being saved correctly
- The issue is with the officer page
- Skip to Step 4

### Step 3: Test Contact Form Submission

#### Option A: Use the Landing Page
1. Open `http://localhost:5173` (or your frontend URL)
2. Scroll to contact section
3. Fill out the form
4. Open browser DevTools (F12) → Network tab
5. Submit the form
6. Check the request:
   - URL should be: `http://localhost:5001/api/contact/submit`
   - Status should be: `201 Created`
   - Response should show success message

#### Option B: Use curl
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

**Expected response:**
```json
{
  "message": "Your message has been sent successfully! We will get back to you soon.",
  "messageId": "..."
}
```

**If you get an error:**
- Check backend server is running
- Verify `VITE_API_URL` in `frontend/.env` is correct
- Check for CORS errors in browser console

### Step 4: Verify Officer Authentication

1. Login as officer:
   - Email: `biruk.officer@gov.et`
   - Password: `birukb0322`

2. Check token in browser console:
```javascript
localStorage.getItem('token')
```

**Should return a JWT token like:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If null or undefined:**
- Login failed
- Check backend server is running
- Verify credentials are correct

### Step 5: Test Officer Messages Page

1. Navigate to Contact Messages page (in officer dashboard)
2. Open browser DevTools (F12) → Network tab
3. Refresh the page
4. Look for request to `/api/contact`

**Check the request:**
- URL: `http://localhost:5001/api/contact?page=1&limit=10`
- Headers: Should include `Authorization: Bearer <token>`
- Status: Should be `200 OK`
- Response: Should contain `messages` array

**Common errors:**

#### 401 Unauthorized
- Token is missing or invalid
- Login again
- Check token is in localStorage

#### 404 Not Found
- Wrong API URL
- Check `VITE_API_URL` in `frontend/.env`
- Should be: `VITE_API_URL=http://localhost:5001/api`

#### 500 Internal Server Error
- Backend error
- Check backend console for errors
- Verify database connection

#### CORS Error
- Backend CORS not configured
- Check `backend/src/server.js` has CORS enabled

### Step 6: Check Environment Variables

#### Frontend `.env` (in `frontend/` folder)
```env
VITE_API_URL=http://localhost:5001/api
```

#### Backend `.env` (in `backend/` folder)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/urban-land-management
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Step 7: Restart Everything

If still not working, restart everything:

```bash
# Stop all servers (Ctrl+C)

# Start MongoDB (if not running)
mongod

# Start backend
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

## Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
**Solution:**
```bash
# Start MongoDB
mongod

# Or if using MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Issue 2: "Port 5001 already in use"
**Solution:**
```bash
# Find and kill process using port 5001
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5001 | xargs kill -9
```

### Issue 3: Messages show "0" but form submits successfully
**Solution:**
- Messages are being saved but not fetched
- Check authentication token
- Verify officer role in database
- Check backend logs for errors

### Issue 4: CORS errors in browser
**Solution:**
Add to `backend/src/server.js` (should already be there):
```javascript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Verification Checklist

After following the steps, verify:

- [ ] Backend server running (port 5001)
- [ ] MongoDB connected
- [ ] Contact form submits successfully (201 response)
- [ ] Messages visible in database (run verify script)
- [ ] Officer can login (token in localStorage)
- [ ] Officer messages page loads without errors
- [ ] Messages appear on officer page

## Still Not Working?

If you've tried everything and it still doesn't work:

1. **Check backend console** for any error messages
2. **Check browser console** for any error messages
3. **Run the verification script** to see database state
4. **Test with Postman** to isolate frontend vs backend issues

### Test with Postman

1. **Submit message:**
   - POST `http://localhost:5001/api/contact/submit`
   - Body (JSON):
     ```json
     {
       "name": "Test",
       "email": "test@test.com",
       "subject": "Test",
       "message": "Test message"
     }
     ```

2. **Login as officer:**
   - POST `http://localhost:5001/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "biruk.officer@gov.et",
       "password": "birukb0322"
     }
     ```
   - Copy the `token` from response

3. **Get messages:**
   - GET `http://localhost:5001/api/contact`
   - Headers:
     - `Authorization: Bearer <paste-token-here>`

If Postman works but the frontend doesn't, the issue is in the frontend code.
If Postman doesn't work, the issue is in the backend.

## Need More Help?

Check these files for debugging:
- `CONTACT_MESSAGES_DEBUG.md` - Detailed debugging guide
- `backend/verify-contact-messages.js` - Database verification script
- Backend console logs
- Browser console logs (F12)
