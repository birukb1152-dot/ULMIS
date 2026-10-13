# Contact Form Setup & Testing Guide

## 🚀 How to Start the System

### 1. Start Backend Server
```bash
cd backend
npm start
```
**Expected output:**
```
🚀 Server running on http://localhost:5000
📋 Environment: development
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
**Expected output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5174/
```

## 📝 How the Contact Form Works

### **Step 1: User Fills Contact Form**
1. Go to landing page: `http://localhost:5174/`
2. Scroll down to "Contact Us" section
3. Fill in the form:
   - **Name** (required): Your full name
   - **Email** (required): Your email address
   - **Phone** (optional): Your phone number
   - **Subject** (required): Brief subject
   - **Message** (required): Your detailed message

### **Step 2: Submit Message**
1. Click "Send Message" button
2. Form validates all required fields
3. Shows loading spinner while sending
4. On success: Green success message appears
5. On error: Red error message appears
6. Form clears automatically on success

### **Step 3: Officer Views Messages**
1. Login as officer: `biruk.officer@gov.et` / `birukb0322`
2. Navigate to "Contact Messages" in sidebar
3. See all submitted messages with:
   - Name, email, subject
   - Status (new, read, replied, closed)
   - Priority level
   - Submission date

### **Step 4: Officer Replies**
1. Click on any message to open details
2. Read the full message
3. Type reply in the text area
4. Click "Send Reply"
5. Reply is saved and status updated to "replied"

## 🔧 Troubleshooting

### Problem: "Failed to send message"
**Solution:**
1. Check if backend is running on port 5000
2. Check browser console for errors (F12)
3. Verify `.env` file exists in frontend folder with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Restart frontend server after creating .env file

### Problem: Backend won't start
**Solution:**
1. Check if MongoDB is running
2. Check backend/.env file has correct MongoDB connection
3. Install dependencies: `cd backend && npm install`
4. Check port 5000 is not already in use

### Problem: CORS Error
**Solution:**
Backend is configured to allow frontend on port 5173 and 5174.
If using different port, update backend/src/server.js:
```javascript
cors({
  origin: 'http://localhost:YOUR_PORT',
  credentials: true,
})
```

## 📊 Database Collections

### ContactMessage Schema:
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (optional),
  subject: String (required),
  message: String (required),
  status: 'new' | 'read' | 'replied' | 'closed',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  replies: [{
    repliedBy: ObjectId (User),
    message: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 API Endpoints

### Public (No Auth Required):
- `POST /api/contact/submit` - Submit contact form

### Protected (Officer Only):
- `GET /api/contact/` - Get all messages
- `GET /api/contact/stats` - Get statistics
- `GET /api/contact/:id` - Get single message
- `POST /api/contact/:id/reply` - Reply to message
- `PATCH /api/contact/:id` - Update status/priority
- `DELETE /api/contact/:id` - Delete message

## ✅ Testing Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5174
- [ ] MongoDB connected
- [ ] .env file created in frontend folder
- [ ] Can access landing page
- [ ] Can fill and submit contact form
- [ ] Success message appears after submission
- [ ] Can login as officer
- [ ] Can see submitted message in officer dashboard
- [ ] Can reply to message
- [ ] Reply appears in message details

## 🔐 Test Accounts

### Officer Account:
- **Email:** biruk.officer@gov.et
- **Password:** birukb0322

### Citizen Account:
- **Email:** abebe@example.com
- **Password:** citizen123

## 📞 Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Try restarting both servers

---

**Note:** After creating the `.env` file, you MUST restart the frontend server for changes to take effect!
