# Notification System Testing Guide 🔔

## 🔧 What Was Fixed

### Issues Found:
1. ❌ Notification system was trying to use JWT tokens (backend API)
2. ❌ App uses local context-based authentication (no JWT)
3. ❌ Notifications weren't persisting to localStorage
4. ❌ Unread count wasn't updating correctly
5. ❌ Notifications weren't visible after page refresh

### Solutions Applied:
1. ✅ Removed JWT/API dependency
2. ✅ Made notifications work with local state
3. ✅ Added localStorage persistence
4. ✅ Fixed unread count calculation
5. ✅ Notifications now persist across sessions

---

## 🧪 How to Test Notifications

### Test 1: Land Request Notification (Citizen → Officer)

**Step 1: Login as Citizen**
```
Email: abebe@example.com
Password: citizen123
```

**Step 2: Submit Land Request**
1. Go to "Land Requests" page
2. Click "Submit New Request"
3. Fill out the form:
   - Land Type: Residential
   - Size: 500 sqm
   - Location: Addis Ababa
   - Purpose: Build home
4. Click "Submit Request"

**Step 3: Logout and Login as Officer**
```
Email: biruk.officer@gov.et
Password: birukb0322
```

**Step 4: Check Notification**
1. Look at notification bell in top-right corner
2. Should show red badge with "1"
3. Click the bell icon
4. Should see notification: "New land request LR-XXX submitted by Abebe Kebede"

**Expected Result:**
- ✅ Notification appears
- ✅ Badge shows "1"
- ✅ Notification is unread (darker background)
- ✅ Clicking notification marks it as read

---

### Test 2: Land Request Approval (Officer → Citizen)

**Step 1: Login as Officer**
```
Email: biruk.officer@gov.et
Password: birukb0322
```

**Step 2: Approve Land Request**
1. Go to "Land Requests" page
2. Find the pending request from Abebe
3. Click "View Details"
4. Change status to "Approved"
5. Enter Land ID: LAND-AA-123
6. Add officer note: "All documents verified"
7. Click "Update Request"

**Step 3: Logout and Login as Citizen**
```
Email: abebe@example.com
Password: citizen123
```

**Step 4: Check Notification**
1. Look at notification bell
2. Should show red badge with "1"
3. Click the bell
4. Should see: "Your land request LR-XXX was approved"

**Expected Result:**
- ✅ Notification appears
- ✅ Badge shows "1"
- ✅ Details show Land ID
- ✅ Notification persists after refresh

---

### Test 3: Infrastructure Report Notification (Citizen → Officer)

**Step 1: Login as Citizen**
```
Email: tigist@example.com
Password: citizen456
```

**Step 2: Submit Infrastructure Report**
1. Go to "Infrastructure Reports" page
2. Click "Submit New Report"
3. Fill out the form:
   - Issue Type: Road Damage
   - Location: Bole Road
   - Description: Large pothole
4. Click "Submit Report"

**Step 3: Logout and Login as Officer**
```
Email: biruk.officer@gov.et
Password: birukb0322
```

**Step 4: Check Notification**
1. Look at notification bell
2. Should show badge with count
3. Click the bell
4. Should see: "Tigist Haile submitted report IR-XXX"

**Expected Result:**
- ✅ Notification appears
- ✅ Badge count increases
- ✅ Shows issue type and location
- ✅ Notification is unread

---

### Test 4: Report Resolution (Officer → Citizen)

**Step 1: Login as Officer**
```
Email: biruk.officer@gov.et
Password: birukb0322
```

**Step 2: Resolve Report**
1. Go to "Infrastructure Reports" page
2. Find the pending report from Tigist
3. Click "View Details"
4. Change status to "Resolved"
5. Add officer note: "Pothole repaired"
6. Click "Update Report"

**Step 3: Logout and Login as Citizen**
```
Email: tigist@example.com
Password: citizen456
```

**Step 4: Check Notification**
1. Look at notification bell
2. Should show badge
3. Click the bell
4. Should see: "Your infrastructure report IR-XXX has been resolved"

**Expected Result:**
- ✅ Notification appears
- ✅ Shows officer note
- ✅ Notification persists
- ✅ Can mark as read

---

### Test 5: Mark as Read

**Step 1: Click Notification Bell**
- Should see list of notifications
- Unread notifications have darker background

**Step 2: Click Individual Notification**
- Notification should become lighter (read state)
- Badge count should decrease by 1

**Step 3: Click "Mark all as read"**
- All notifications should become lighter
- Badge should disappear (count = 0)

**Expected Result:**
- ✅ Individual mark as read works
- ✅ Mark all as read works
- ✅ Badge count updates correctly
- ✅ Visual feedback is clear

---

### Test 6: Persistence After Refresh

**Step 1: Create Some Notifications**
- Submit land request or infrastructure report
- Switch users and check notifications

**Step 2: Refresh the Page (F5)**
- Notifications should still be there
- Badge count should be correct
- Read/unread state should persist

**Step 3: Logout and Login Again**
- Notifications should still be visible
- Badge count should match

**Expected Result:**
- ✅ Notifications persist after refresh
- ✅ Notifications persist after logout/login
- ✅ Read state is maintained
- ✅ Badge count is accurate

---

### Test 7: Multiple Notifications

**Step 1: Create Multiple Notifications**
1. Login as citizen
2. Submit 3 land requests
3. Submit 2 infrastructure reports

**Step 2: Login as Officer**
- Badge should show "5"
- Dropdown should show all 5 notifications
- Should be able to scroll if more than 5

**Step 3: Mark Some as Read**
- Click 2 notifications
- Badge should show "3"
- Read notifications should be lighter

**Expected Result:**
- ✅ Multiple notifications display correctly
- ✅ Badge count is accurate
- ✅ Can scroll through notifications
- ✅ Read/unread states are distinct

---

## 🎯 Notification Types

### 1. Land Request (Citizen → Officer)
```
Type: Land Request
Title: New land request LR-XXX
Message: [Citizen Name] submitted a land request
Details: [Land Type] · [Location]
Recipients: All officers
```

### 2. Approval/Rejection (Officer → Citizen)
```
Type: Approval / Rejection
Title: Land request approved/rejected
Message: Your land request LR-XXX was approved/rejected
Details: Land ID: XXX or Reason: XXX
Recipients: Specific citizen
```

### 3. Infrastructure Report (Citizen → Officer)
```
Type: Infrastructure Report
Title: New infrastructure report
Message: [Citizen Name] submitted report IR-XXX
Details: [Issue Type] · [Location]
Recipients: All officers
```

### 4. Resolution Updates (Officer → Citizen)
```
Type: Resolution Updates
Title: Report resolved
Message: Your infrastructure report IR-XXX has been resolved
Details: Officer note: XXX
Recipients: Specific citizen
```

### 5. Comments (Bidirectional)
```
Type: Comments
Title: New comment on IR-XXX
Message: [User] left a comment on report IR-XXX
Details: [Comment text]
Recipients: Officers or specific citizen
```

---

## 🐛 Troubleshooting

### Problem: No notifications appear

**Check:**
1. Are you logged in?
2. Did you submit a request/report?
3. Are you logged in as the correct user type?
   - Citizens see approval/resolution notifications
   - Officers see submission notifications

**Solution:**
- Logout and login again
- Clear localStorage: `localStorage.clear()`
- Refresh the page

---

### Problem: Badge count is wrong

**Check:**
1. Open browser console (F12)
2. Type: `localStorage.getItem('notifications')`
3. Check if notifications are stored

**Solution:**
```javascript
// Clear notifications
localStorage.removeItem('notifications')
// Refresh page
location.reload()
```

---

### Problem: Notifications don't persist

**Check:**
1. Browser localStorage is enabled
2. Not in incognito/private mode
3. Browser has storage space

**Solution:**
- Use regular browser window (not incognito)
- Clear browser cache
- Check browser settings for localStorage

---

### Problem: Can't mark as read

**Check:**
1. Clicking the notification (not the bell)
2. Notification ID is valid
3. Console for errors

**Solution:**
- Click directly on the notification text
- Try "Mark all as read" button
- Refresh the page

---

## 📊 Expected Behavior Summary

| Action | Citizen Sees | Officer Sees |
|--------|-------------|--------------|
| **Citizen submits land request** | Nothing | ✅ New request notification |
| **Officer approves request** | ✅ Approval notification | Nothing |
| **Officer rejects request** | ✅ Rejection notification | Nothing |
| **Citizen submits infra report** | Nothing | ✅ New report notification |
| **Officer resolves report** | ✅ Resolution notification | Nothing |
| **Citizen comments on report** | Nothing | ✅ Comment notification |
| **Officer comments on report** | ✅ Comment notification | Nothing |

---

## ✅ Success Checklist

After testing, verify:

- [ ] Citizen can submit land request
- [ ] Officer receives notification
- [ ] Badge shows correct count
- [ ] Officer can approve/reject request
- [ ] Citizen receives approval/rejection notification
- [ ] Citizen can submit infrastructure report
- [ ] Officer receives report notification
- [ ] Officer can resolve report
- [ ] Citizen receives resolution notification
- [ ] Notifications persist after refresh
- [ ] Notifications persist after logout/login
- [ ] Can mark individual notification as read
- [ ] Can mark all notifications as read
- [ ] Badge count updates correctly
- [ ] Read/unread states are visually distinct
- [ ] Notifications are sorted by date (newest first)
- [ ] Dropdown shows max 5 notifications
- [ ] "View All" link works (if implemented)

---

## 🎨 Visual Indicators

### Unread Notification
```
┌─────────────────────────────────┐
│ 🔔 New land request LR-001      │ ← Darker background
│ Abebe Kebede submitted...       │ ← White text
│ Residential · Addis Ababa        │ ← Gray details
│ 2 minutes ago                    │ ← Timestamp
└─────────────────────────────────┘
```

### Read Notification
```
┌─────────────────────────────────┐
│ 🔔 New land request LR-001      │ ← Lighter background
│ Abebe Kebede submitted...       │ ← Gray text
│ Residential · Addis Ababa        │ ← Lighter details
│ 2 minutes ago                    │ ← Timestamp
└─────────────────────────────────┘
```

### Badge
```
🔔 (3)  ← Red badge with count
```

---

## 🔍 Debug Commands

Open browser console (F12) and try:

```javascript
// View all notifications
JSON.parse(localStorage.getItem('notifications'))

// View current user
JSON.parse(localStorage.getItem('currentUser'))

// Clear all notifications
localStorage.removeItem('notifications')

// Clear everything
localStorage.clear()

// Reload page
location.reload()
```

---

## 📝 Notes

1. **Notifications are stored locally** - They persist in browser localStorage
2. **No backend required** - System works with local state
3. **Real-time updates** - Notifications appear immediately
4. **User-specific** - Each user sees only their relevant notifications
5. **Role-based** - Officers see submissions, citizens see approvals/resolutions

---

**Last Updated:** May 7, 2026
**Status:** ✅ Fixed and Working
**Version:** 2.0.0
