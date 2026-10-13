import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';

// Submit contact form (public - no auth required)
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      message: 'Your message has been sent successfully! We will get back to you soon.',
      messageId: contactMessage._id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};

// Get all contact messages (officer/admin only)
export const getAllMessages = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await ContactMessage.find(query)
      .populate('assignedTo', 'fullName email')
      .populate('replies.repliedBy', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ContactMessage.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get single message by ID
export const getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id)
      .populate('assignedTo', 'fullName email role')
      .populate('replies.repliedBy', 'fullName email role');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Mark as read
    const alreadyRead = message.readBy.some(
      r => r.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({ user: req.user._id });
      if (message.status === 'new') {
        message.status = 'read';
      }
      await message.save();
    }

    res.json(message);
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

// Reply to a message (officer/admin only)
export const replyToMessage = async (req, res) => {
  try {
    const { message: replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ error: 'Reply message is required' });
    }

    const contactMessage = await ContactMessage.findById(req.params.id);

    if (!contactMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    contactMessage.replies.push({
      repliedBy: req.user._id,
      message: replyMessage
    });

    contactMessage.status = 'replied';

    await contactMessage.save();

    // Populate the reply
    await contactMessage.populate('replies.repliedBy', 'fullName email role');

    // TODO: Send email notification to the original sender
    // You can implement email sending here using nodemailer

    res.json({
      message: 'Reply sent successfully',
      contactMessage
    });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
};

// Update message status
export const updateMessageStatus = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'fullName email');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message updated successfully', contactMessage: message });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Delete message (admin only)
export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

// Get message statistics
export const getMessageStats = async (req, res) => {
  try {
    const stats = await ContactMessage.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await ContactMessage.countDocuments();
    const newMessages = await ContactMessage.countDocuments({ status: 'new' });
    const repliedMessages = await ContactMessage.countDocuments({ status: 'replied' });

    res.json({
      total,
      new: newMessages,
      replied: repliedMessages,
      byStatus: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
