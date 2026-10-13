# Urban Land Management System - Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB installed and running
- Git (optional)

### 1. Start MongoDB Service
MongoDB must be running before starting the backend server.

**Windows:**
```bash
# Check if MongoDB is running
Get-Service -Name MongoDB

# If not running, start it
net start MongoDB
```

**Mac/Linux:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it
sudo systemctl start mongod
```

### 2. Start Backend Server

```bash
cd backend
npm install  # First time only
npm start
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5001
```

**If you see "Port already in use" error:**
- The port is configured in `backend/.env` (currently set to 5001)
- You can change it to another port like 5002, 5003, etc.
- Remember to update `frontend/.env` to match!

### 3. Start Frontend Server

```bash
cd frontend
npm install  # First time only
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Access the Application

Open your browser and go to: **http://localhost:5173/**

---

## 📧 Contact Form - How It Works

### For Visitors (No Login Required)

1. **Navigate to Landing Page**
   - Go to http://localhost:5173/
   - Scroll down to the "Contact Us" section

2. **Fill Out the Form**
   - **Name** (required): Your full name
   - **Email** (required): Your email address
   - **Phone** (optional): Your phone number
   - **Subject** (required): Brief description of your inquiry
   - **Message** (required): Detailed message

3. **Submit**
   - Click "Send Message" button
   - You'll see a success message: "Your message has been sent successfully!"
   - The form will clear automatically

4. **What Happens Next?**
   - Your message is saved in the database
   - All officers and admins are notified
   - An officer will review and respond to your message

### For Officers/Admins (Login Required)

1. **Login**
   - Click "Login" button on landing page
   - Use officer credentials:
     - Email: `biruk.officer@gov.et`
     - Password: `birukb0322`

2. **View Contact Messages**
   - After login, you'll see the dashboard
   - Click "Contact Messages" in the sidebar
   - You'll see all submitted messages

3. **Message Management**
   - **View Details**: Click on any message to see full details
   - **Reply**: Type your response and click "Send Reply"
   - **Change Status**: Mark as "In Progress", "Resolved", or "Closed"
   - **Change Priority**: Set to "Low", "Medium", or "High"
   - **Delete**: Remove spam or resolved messages

4. **Filters**
   - **Search**: Search by name, email, or subject
   - **Status Filter**: Show only Pending, In Progress, Resolved, or Closed
   - **Priority Filter**: Show only Low, Medium, or High priority

---

## 🔔 Notification System - How It Works

### Notification Flow

#### 1. **Citizen Submits Land Request**
```
Citizen → Submits Land Request
         ↓
Officers & Admins → Receive Notification
                   "New land request LR-XXX submitted by [Name]"
```

#### 2. **Officer Approves/Rejects Land Request**
```
Officer → Approves/Rejects Request
         ↓
Citizen → Receives Notification
         "Your land request LR-XXX has been approved/rejected"
```

#### 3. **Citizen Submits Infrastructure Report**
```
Citizen → Submits Infrastructure Report
         ↓
Officers & Admins → Receive Notification
                   "New infrastructure report IR-XXX submitted by [Name]"
```

#### 4. **Officer Resolves Infrastructure Report**
```
Officer → Marks Report as Resolved
         ↓
Citizen → Receives Notification
         "Your infrastructure report IR-XXX has been resolved"
```

### Viewing Notifications

1. **Notification Bell Icon**
   - Located in the top-right corner of the dashboard
   - Shows red badge with unread count
   - Click to open notification dropdown

2. **Notification Dropdown**
   - Shows recent notifications (up to 5)
   - Click "Mark all as read" to clear all
   - Click individual notification to mark as read
   - Click "View All" to see full notification history

3. **Notification Details**
   - **Type**: Land Request, Infrastructure Report, Approval/Rejection, etc.
   - **Title**: Brief summary
   - **Message**: Detailed information
   - **Time**: When the notification was created
   - **Status**: Read or Unread

### Notification Types

| Type | Who Receives | When |
|------|-------------|------|
| **Land Request** | Officers & Admins | Citizen submits land request |
| **Approval/Rejection** | Citizen | Officer approves/rejects land request |
| **Infrastructure Report** | Officers & Admins | Citizen submits infrastructure report |
| **Resolution Updates** | Citizen | Officer resolves infrastructure report |
| **Comments** | Citizen or Officers | Someone comments on a report |

---

## 🎯 Testing the System

### Test Contact Form

1. Open landing page: http://localhost:5173/
2. Scroll to "Contact Us" section
3. Fill out the form:
   ```
   Name: Test User
   Email: test@example.com
   Phone: +251 911 123456
   Subject: Testing Contact Form
   Message: This is a test message to verify the contact form works correctly.
   ```
4. Click "Send Message"
5. You should see: ✅ "Your message has been sent successfully!"

### Test Notifications

#### Test 1: Land Request Notification
1. **As Citizen:**
   - Login with citizen account (or register new account)
   - Go to "Land Requests" page
   - Click "Submit New Request"
   - Fill out the form and submit

2. **As Officer:**
   - Login with officer account
   - Check notification bell (should show "1" badge)
   - Click bell to see notification
   - Go to "Land Requests" page
   - Approve or reject the request

3. **Back to Citizen:**
   - Logout and login as citizen
   - Check notification bell (should show "1" badge)
   - Click to see approval/rejection notification

#### Test 2: Infrastructure Report Notification
1. **As Citizen:**
   - Login with citizen account
   - Go to "Infrastructure Reports" page
   - Click "Submit New Report"
   - Fill out the form and submit

2. **As Officer:**
   - Login with officer account
   - Check notification bell (should show new notification)
   - Go to "Infrastructure Reports" page
   - Mark report as "Resolved"

3. **Back to Citizen:**
   - Logout and login as citizen
   - Check notification bell
   - Click to see resolution notification

---

## 🔧 Troubleshooting

### Contact Form Not Working

**Problem:** "Failed to send message" error

**Solutions:**

1. **Check Backend Server**
   ```bash
   # Make sure backend is running
   cd backend
   npm start
   ```

2. **Check MongoDB**
   ```bash
   # Windows
   Get-Service -Name MongoDB
   
   # Mac/Linux
   sudo systemctl status mongod
   ```

3. **Check API URL**
   - Open `frontend/.env`
   - Verify: `VITE_API_URL=http://localhost:5001/api`
   - Port should match backend port in `backend/.env`

4. **Check Browser Console**
   - Press F12 to open Developer Tools
   - Go to "Console" tab
   - Look for error messages
   - Common errors:
     - `ERR_CONNECTION_REFUSED` → Backend not running
     - `CORS error` → Backend CORS not configured
     - `404 Not Found` → Wrong API URL

5. **Restart Frontend**
   ```bash
   # Stop frontend (Ctrl+C)
   # Start again
   npm run dev
   ```

### Notifications Not Showing

**Problem:** Notification bell shows "0" even after submitting requests

**Solutions:**

1. **Check if User is Logged In**
   - Notifications only work for logged-in users
   - Make sure you're logged in with valid credentials

2. **Check Backend Logs**
   - Look at backend terminal for errors
   - Should see: "Notification created for user..."

3. **Refresh the Page**
   - Notifications are fetched on page load
   - Try refreshing the browser (F5)

4. **Check Network Tab**
   - Press F12 → Network tab
   - Look for `/api/notifications` request
   - Check if it returns data

5. **Clear Browser Cache**
   - Sometimes old data is cached
   - Clear cache and reload

### Port Already in Use

**Problem:** Backend shows "EADDRINUSE: address already in use"

**Solutions:**

1. **Change Port**
   - Edit `backend/.env`: Change `PORT=5001` to `PORT=5002`
   - Edit `frontend/.env`: Change `VITE_API_URL=http://localhost:5002/api`
   - Restart both servers

2. **Kill Existing Process**
   ```bash
   # Windows
   netstat -ano | findstr :5001
   taskkill /F /PID [PID_NUMBER]
   
   # Mac/Linux
   lsof -i :5001
   kill -9 [PID_NUMBER]
   ```

---

## 📱 User Accounts

### Default Accounts

#### Super Admin / Officer
```
Email: biruk.officer@gov.et
Password: birukb0322
Role: Officer (Super Admin)
```

#### Citizen 1
```
Email: abebe@example.com
Password: citizen123
Role: Citizen
```

#### Citizen 2
```
Email: tigist@example.com
Password: citizen456
Role: Citizen
```

### Register New Account

1. Go to landing page
2. Click "Register" button
3. Fill out registration form
4. New accounts are always created as "Citizen" role
5. Officers can only be added by existing officers through the dashboard

---

## 🎨 Features Overview

### Landing Page (Public)
- ✅ Hero section with call-to-action
- ✅ About section with city image
- ✅ Features showcase
- ✅ Testimonials carousel (6 people, 3 cards at a time)
- ✅ Contact form (no login required)
- ✅ Footer with links

### Dashboard (Logged In)
- ✅ KPI cards with statistics
- ✅ Recent activities
- ✅ Quick actions
- ✅ Notification bell with dropdown

### Citizen Features
- ✅ Submit land requests
- ✅ Track land request status
- ✅ Submit infrastructure reports
- ✅ View report status and comments
- ✅ Receive notifications

### Officer Features
- ✅ View all land requests
- ✅ Approve/reject land requests
- ✅ View all infrastructure reports
- ✅ Update report status
- ✅ Add comments to reports
- ✅ View and reply to contact messages
- ✅ Manage users (add/remove officers)
- ✅ Receive notifications

---

## 🔐 Security Notes

1. **JWT Authentication**
   - Tokens expire after 7 days
   - Stored in localStorage
   - Automatically attached to API requests

2. **Password Security**
   - Passwords are hashed with bcrypt
   - Never stored in plain text
   - Minimum 6 characters required

3. **Role-Based Access**
   - Citizens can only see their own data
   - Officers can see all data
   - Super Admin cannot be deleted

4. **API Protection**
   - Most endpoints require authentication
   - Contact form is public (no auth required)
   - CORS enabled for frontend domain

---

## 📞 Support

If you encounter any issues:

1. Check this guide first
2. Check browser console for errors (F12)
3. Check backend terminal for errors
4. Verify MongoDB is running
5. Verify both servers are running
6. Try restarting both servers

**Contact:**
- Email: birukb1152@gmail.com
- Email: amha03@gmail.com
- Phone: +251 903 22 44 46
- Phone: +251 952 08 08 73

---

## 🎉 Success Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5001
- [ ] Frontend server is running on port 5173
- [ ] Can access landing page at http://localhost:5173/
- [ ] Can submit contact form without login
- [ ] Can login with officer account
- [ ] Can see contact messages in officer dashboard
- [ ] Can submit land request as citizen
- [ ] Officer receives notification for land request
- [ ] Can approve land request as officer
- [ ] Citizen receives notification for approval
- [ ] Notification bell shows correct unread count

---

**Last Updated:** May 7, 2026
**Version:** 1.0.0
