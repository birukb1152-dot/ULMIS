# Login Troubleshooting Guide

## Quick Checks

### 1. Check Browser Console for Errors
1. Open login page
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. Look for any red error messages

**Common errors and solutions:**

#### Error: "Network Error" or "ERR_CONNECTION_REFUSED"
**Cause**: Backend server not running
**Solution**: 
```bash
cd backend
npm run dev
```

#### Error: "Invalid email or password"
**Cause**: Wrong credentials or user doesn't exist in database
**Solution**: Use correct credentials:
- Email: `biruk.officer@gov.et`
- Password: `birukb0322`

#### Error: "Cannot read property 'data' of undefined"
**Cause**: API response format issue
**Solution**: Check backend is returning correct format

### 2. Check Network Tab
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for request to `/auth/login`
5. Click on it and check:
   - **Status**: Should be 200 OK
   - **Response**: Should contain `token` and `user`

### 3. Verify Backend is Running
Open a new terminal and run:
```bash
curl http://localhost:5001/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"biruk.officer@gov.et\",\"password\":\"birukb0322\"}"
```

**Expected response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullName": "Biruk Birhanu",
    "email": "biruk.officer@gov.et",
    "role": "officer",
    ...
  }
}
```

### 4. Clear Browser Cache
Sometimes old code is cached:
1. Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (**Ctrl+F5** or **Cmd+Shift+R**)

### 5. Check Frontend Environment
Make sure `frontend/.env` has:
```env
VITE_API_URL=http://localhost:5001/api
```

### 6. Restart Frontend Server
```bash
# Stop frontend (Ctrl+C)
cd frontend
npm run dev
```

## Step-by-Step Login Test

### Test 1: Backend API Direct Test
```bash
cd backend
node seed-users.js
```

**Expected output:**
```
✅ Officer already exists in database
Email: biruk.officer@gov.et
```

### Test 2: Login via curl
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"biruk.officer@gov.et","password":"birukb0322"}'
```

**If this works**, backend is fine. Issue is in frontend.
**If this fails**, backend has an issue.

### Test 3: Login via Browser Console
1. Open login page
2. Press F12 → Console tab
3. Run this code:
```javascript
fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'biruk.officer@gov.et',
    password: 'birukb0322'
  })
})
.then(res => res.json())
.then(data => console.log('Login response:', data))
.catch(err => console.error('Login error:', err));
```

**Expected output:**
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: { ... }
}
```

## Alternative: Use Old Login Method (Temporary)

If you need to access the dashboard urgently, I can revert to the old login method temporarily:

### Option A: Revert Login (Quick Fix)
This will let you login with local data (no backend call):

1. I can change the login back to use local seed data
2. You can login and access dashboard
3. But contact messages still won't work (needs JWT token)

### Option B: Hybrid Approach
1. Keep new login for officers (with JWT)
2. Add fallback to old method if backend fails
3. Best of both worlds

## What Information Do I Need?

To help you better, please tell me:

1. **What error message do you see?**
   - In the login form?
   - In browser console (F12)?

2. **What happens when you click "Sign In"?**
   - Nothing happens?
   - Error message appears?
   - Page refreshes?
   - Loading spinner appears then stops?

3. **Backend server status:**
   - Is it running?
   - Any errors in backend console?

4. **Network tab shows:**
   - Is there a request to `/auth/login`?
   - What status code? (200, 401, 404, 500?)
   - What response data?

## Quick Fixes to Try

### Fix 1: Clear Everything and Restart
```bash
# Stop all servers (Ctrl+C)

# Clear browser
# Press F12 → Application → Clear storage → Clear site data

# Restart backend
cd backend
npm run dev

# Restart frontend (new terminal)
cd frontend
npm run dev

# Try login again
```

### Fix 2: Verify User Exists
```bash
cd backend
node seed-users.js
```

Should show officer exists.

### Fix 3: Test Backend Directly
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"biruk.officer@gov.et","password":"birukb0322"}'
```

Should return token and user.

## Need Immediate Access?

If you need to access the dashboard right now and can't wait, let me know and I can:

1. **Revert to old login** (works immediately, but no contact messages)
2. **Create a hybrid solution** (tries new login, falls back to old if fails)
3. **Debug the specific error** you're seeing

---

**Please tell me:**
- What error message you see
- What's in the browser console (F12)
- Is backend server running?

Then I can give you the exact fix!
