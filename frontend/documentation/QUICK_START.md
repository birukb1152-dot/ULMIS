# 🚀 Quick Start Guide

## Current Status: ✅ READY TO USE

### Servers Running:
- ✅ **Backend**: http://localhost:5001 (MongoDB connected)
- ✅ **Frontend**: http://localhost:5174

### Access the Application:
Open your browser and go to: **http://localhost:5174/**

---

## 📧 Test Contact Form (No Login Required)

1. Go to http://localhost:5174/
2. Scroll down to "Contact Us" section
3. Fill out the form:
   - Name: Your name
   - Email: Your email
   - Phone: Your phone (optional)
   - Subject: Brief description
   - Message: Your message
4. Click "Send Message"
5. You should see: ✅ "Your message has been sent successfully!"

---

## 🔔 Test Notification System

### Step 1: Login as Officer
1. Click "Login" button on landing page
2. Use these credentials:
   ```
   Email: biruk.officer@gov.et
   Password: birukb0322
   ```
3. You'll see the dashboard

### Step 2: View Contact Messages
1. Click "Contact Messages" in the sidebar
2. You'll see all submitted messages from the contact form
3. Click on a message to view details
4. You can reply, change status, or delete

### Step 3: Test Land Request Notifications
1. Logout (click profile icon → Logout)
2. Register a new citizen account or login with:
   ```
   Email: abebe@example.com
   Password: citizen123
   ```
3. Go to "Land Requests" page
4. Click "Submit New Request"
5. Fill out and submit the form
6. **Officer will receive notification** ✅

### Step 4: Test Approval Notifications
1. Logout and login as officer again
2. Check notification bell (should show "1" badge)
3. Click bell to see notification
4. Go to "Land Requests" page
5. Click on the new request
6. Approve or reject it
7. **Citizen will receive notification** ✅

---

## 🎯 Key Features

### Contact Form
- ✅ Works without login
- ✅ Sends to all officers/admins
- ✅ Officers can reply and manage messages
- ✅ Status tracking (Pending, In Progress, Resolved, Closed)
- ✅ Priority levels (Low, Medium, High)

### Notification System
- ✅ Real-time notifications
- ✅ Unread count badge
- ✅ Notification dropdown
- ✅ Mark as read / Mark all as read
- ✅ Auto-refresh every 30 seconds

### Notification Flow
```
Citizen submits land request
    ↓
Officers receive notification
    ↓
Officer approves/rejects
    ↓
Citizen receives notification
```

```
Citizen submits infrastructure report
    ↓
Officers receive notification
    ↓
Officer resolves report
    ↓
Citizen receives notification
```

---

## 🔐 Default Accounts

### Officer (Super Admin)
```
Email: biruk.officer@gov.et
Password: birukb0322
```

### Citizen 1
```
Email: abebe@example.com
Password: citizen123
```

### Citizen 2
```
Email: tigist@example.com
Password: citizen456
```

---

## 🔧 If Something Goes Wrong

### Backend Not Running?
```bash
cd backend
npm start
```

### Frontend Not Running?
```bash
cd frontend
npm run dev
```

### MongoDB Not Running?
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Contact Form Not Working?
1. Check backend is running (http://localhost:5001)
2. Check MongoDB is running
3. Check browser console (F12) for errors
4. Verify `frontend/.env` has: `VITE_API_URL=http://localhost:5001/api`

### Notifications Not Showing?
1. Make sure you're logged in
2. Refresh the page (F5)
3. Check backend terminal for errors
4. Check browser console (F12) for errors

---

## 📚 Full Documentation

For detailed documentation, see: **SETUP_AND_USAGE_GUIDE.md**

---

## ✅ Success Checklist

- [ ] Can access landing page at http://localhost:5174/
- [ ] Can submit contact form without login
- [ ] Can login with officer account
- [ ] Can see contact messages in officer dashboard
- [ ] Can reply to contact messages
- [ ] Can submit land request as citizen
- [ ] Officer receives notification for land request
- [ ] Can approve land request as officer
- [ ] Citizen receives notification for approval
- [ ] Notification bell shows correct unread count

---

**Need Help?**
- Email: birukb1152@gmail.com
- Email: amha03@gmail.com
- Phone: +251 903 22 44 46

**Last Updated:** May 7, 2026
