# Contact Message Reply System - Implementation Guide

## Current Situation

**What Works:**
- ✅ Users can submit contact messages from the landing page (no login required)
- ✅ Officers can view all messages in the Officer Messages page
- ✅ Officers can reply to messages
- ✅ Replies are stored in the database

**What's Missing:**
- ❌ Users cannot see the replies officers send
- ❌ No notification system for users when they receive a reply

---

## Solution Options

### Option 1: Email Notifications (RECOMMENDED) ⭐

**How It Works:**
1. User submits contact form with their email
2. Officer replies through the system
3. System automatically sends email to user with the reply
4. User receives reply in their inbox

**Advantages:**
- ✅ No login required for users
- ✅ Instant notification
- ✅ Users already have email addresses
- ✅ Professional and expected behavior
- ✅ Easy to implement

**Implementation:**

#### Step 1: Install nodemailer
```bash
cd backend
npm install nodemailer
```

#### Step 2: Add email configuration to `.env`
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Step 3: Create email service
Create `backend/src/services/emailService.js`:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendReplyEmail = async (to, name, subject, replyMessage, originalMessage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Re: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                    color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .reply-box { background: white; padding: 20px; border-radius: 8px; 
                       border-left: 4px solid #10b981; margin: 20px 0; }
          .original-box { background: #e5e7eb; padding: 15px; border-radius: 8px; 
                          margin: 20px 0; font-size: 14px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Urban Land Management</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Response to Your Message</p>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for contacting us. We have reviewed your message and here is our response:</p>
            
            <div class="reply-box">
              <h3 style="margin-top: 0; color: #10b981;">Our Response:</h3>
              <p style="white-space: pre-wrap;">${replyMessage}</p>
            </div>

            <div class="original-box">
              <h4 style="margin-top: 0; color: #6b7280;">Your Original Message:</h4>
              <p style="white-space: pre-wrap; margin: 0;">${originalMessage}</p>
            </div>

            <p>If you have any further questions or concerns, please don't hesitate to contact us again through our website.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Urban Land Management Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2026 Urban Land Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};
```

#### Step 4: Update contact controller
In `backend/src/controllers/contactController.js`, update the `replyToMessage` function:

```javascript
import { sendReplyEmail } from '../services/emailService.js';

export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const contactMessage = await ContactMessage.findById(id);
    if (!contactMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Add reply to database
    contactMessage.replies.push({
      message,
      repliedBy: req.user.id,
      createdAt: new Date()
    });
    contactMessage.status = 'replied';
    await contactMessage.save();

    // Send email notification to user
    const emailResult = await sendReplyEmail(
      contactMessage.email,
      contactMessage.name,
      contactMessage.subject,
      message,
      contactMessage.message
    );

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // Still return success since reply was saved to database
    }

    res.json({ 
      message: 'Reply sent successfully',
      emailSent: emailResult.success
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

#### Step 5: Gmail App Password Setup
If using Gmail:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate an app password for "Mail"
5. Use this password in `.env` file

---

### Option 2: Tracking Code System

**How It Works:**
1. User submits contact form
2. System generates unique tracking code (e.g., "TRK-12345")
3. User receives tracking code on confirmation page
4. Add "Track My Message" page on landing
5. User enters tracking code to see status and replies

**Advantages:**
- ✅ No login required
- ✅ No email service needed
- ✅ User can check anytime

**Disadvantages:**
- ❌ User must remember tracking code
- ❌ No automatic notification
- ❌ Extra development work

---

### Option 3: Citizen Dashboard Integration

**How It Works:**
1. User must register/login as citizen
2. Add "My Messages" page to citizen dashboard
3. Shows all messages submitted by that citizen
4. Can see replies from officers

**Advantages:**
- ✅ Integrated with existing system
- ✅ Secure and organized

**Disadvantages:**
- ❌ Requires user registration
- ❌ Contact form should be public (no login)
- ❌ Extra friction for simple questions

---

## Recommendation

**Use Option 1: Email Notifications**

This is the most user-friendly and professional solution:
- Users expect to receive email replies
- No extra steps for users
- Works with existing contact form
- Industry standard practice
- Easy to implement

---

## Testing the Email System

After implementation, test with:

1. **Submit a test message** from landing page
2. **Login as officer** and reply to the message
3. **Check the email inbox** of the sender
4. **Verify email formatting** looks professional
5. **Test with different email providers** (Gmail, Outlook, etc.)

---

## Alternative: SMS Notifications

If you want to add SMS notifications:
- Use Twilio or similar service
- Send SMS when officer replies
- Requires phone number in contact form
- Additional cost per SMS

---

## Current Status

- ✅ Contact form works (public, no login)
- ✅ Officers can view and reply to messages
- ✅ Replies are stored in database
- ⏳ Email notification system (recommended next step)

---

**Recommendation**: Implement Option 1 (Email Notifications) for the best user experience.

**Estimated Time**: 1-2 hours
**Difficulty**: Easy
**Cost**: Free (using Gmail or similar)

---

**Last Updated**: May 10, 2026
