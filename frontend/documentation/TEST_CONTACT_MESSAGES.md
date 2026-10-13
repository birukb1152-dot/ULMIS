# Test Contact Messages - Quick Guide

## ✅ Good News!
Your messages ARE in the database! I found 2 messages:

1. **From**: alemu (alemu@gmail.com)
   - **Subject**: to test the contact page
   - **Status**: new
   - **Sent**: Today at 18:50

2. **From**: Abebe (abebe@gmail.com)
   - **Subject**: to test the contact page
   - **Status**: new
   - **Sent**: Today at 16:52

## Now Let's Test the Officer Dashboard

### Step 1: Make Sure Backend is Running
✅ You already confirmed it's running on port 5001 - Great!

### Step 2: Login as Officer
1. Open your frontend: `http://localhost:5173` (or your frontend URL)
2. Click "Login"
3. Use these credentials:
   - **Email**: `biruk.officer@gov.et`
   - **Password**: `birukb0322`
4. Click "Sign In"

### Step 3: Navigate to Contact Messages
1. After login, you should see the dashboard
2. Look for "Contact Messages" in the sidebar menu
3. Click on it

### Step 4: Check Browser Console
If messages don't appear:
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for any errors (red text)
4. Go to **Network** tab
5. Refresh the page
6. Look for a request to `/api/contact`
7. Click on it and check:
   - **Status**: Should be 200 OK
   - **Response**: Should show your 2 messages

## Common Issues & Solutions

### Issue 1: "401 Unauthorized" Error
**Cause**: Not logged in or token expired
**Solution**: 
- Logout and login again
- Check browser console: `localStorage.getItem('token')`
- Should return a long string (JWT token)

### Issue 2: "404 Not Found" Error
**Cause**: Wrong API URL
**Solution**: 
- Check `frontend/.env` has: `VITE_API_URL=http://localhost:5001/api`
- Restart frontend server after changing .env

### Issue 3: Messages Show "0" or Empty
**Cause**: Frontend not fetching correctly
**Solution**: 
- Check Network tab in browser DevTools
- Look for request to `http://localhost:5001/api/contact`
- Check if Authorization header is present
- Check response data

### Issue 4: CORS Error
**Cause**: Backend not allowing frontend requests
**Solution**: 
- Check backend console for CORS errors
- Backend should have CORS enabled for `http://localhost:5173`

## Manual API Test (Using Browser Console)

If the dashboard doesn't work, test the API directly:

### 1. Get Your Token
```javascript
// In browser console (F12)
const token = localStorage.getItem('token');
console.log('Token:', token);
```

### 2. Fetch Messages Manually
```javascript
// In browser console
fetch('http://localhost:5001/api/contact?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => res.json())
.then(data => console.log('Messages:', data))
.catch(err => console.error('Error:', err));
```

**Expected Result:**
```javascript
{
  messages: [
    {
      _id: "69fe063f0b638a1390a66a14",
      name: "alemu",
      email: "alemu@gmail.com",
      subject: "to test the contact page",
      status: "new",
      priority: "medium",
      // ... more fields
    },
    // ... more messages
  ],
  totalPages: 1,
  currentPage: 1,
  total: 2
}
```

## Test Using Postman (Alternative)

### 1. Login to Get Token
- **Method**: POST
- **URL**: `http://localhost:5001/api/auth/login`
- **Body** (JSON):
```json
{
  "email": "biruk.officer@gov.et",
  "password": "birukb0322"
}
```
- **Copy the token** from response

### 2. Get Messages
- **Method**: GET
- **URL**: `http://localhost:5001/api/contact`
- **Headers**:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`

## What to Check

1. ✅ Backend running on port 5001
2. ✅ Messages in database (2 messages confirmed)
3. ⏳ Frontend can fetch messages (needs testing)
4. ⏳ Officer authentication works (needs testing)
5. ⏳ Messages display on dashboard (needs testing)

## Next Steps

1. **Login as officer** using the credentials above
2. **Navigate to Contact Messages** page
3. **Check if messages appear**
4. **If not**, open browser console (F12) and check for errors
5. **Report back** what you see:
   - Do you see the 2 messages?
   - Any errors in console?
   - What does the Network tab show?

## Quick Verification Commands

Run these in your terminal to verify everything:

```bash
# Check if backend is running
curl http://localhost:5001/api/contact/submit

# Should return: {"error":"Please fill in all required fields"}
# This means the endpoint is working!
```

---

**Status**: 
- ✅ Backend: Running
- ✅ Database: Connected
- ✅ Messages: Saved (2 messages)
- ⏳ Frontend: Needs testing

**Your Action**: Login as officer and check if messages appear!
