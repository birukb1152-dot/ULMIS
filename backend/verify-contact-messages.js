import mongoose from 'mongoose';
import ContactMessage from './src/models/ContactMessage.js';
import dotenv from 'dotenv';

dotenv.config();

async function verifyContactMessages() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Check total messages
    const totalMessages = await ContactMessage.countDocuments();
    console.log(`📊 Total messages in database: ${totalMessages}\n`);

    if (totalMessages === 0) {
      console.log('⚠️  No messages found in database!');
      console.log('📝 Creating a test message...\n');

      const testMessage = new ContactMessage({
        name: 'Test User',
        email: 'test@example.com',
        phone: '0911000000',
        subject: 'Test Message from Verification Script',
        message: 'This is a test message to verify the contact system is working.'
      });

      await testMessage.save();
      console.log('✅ Test message created successfully!');
      console.log('Message ID:', testMessage._id);
      console.log('Status:', testMessage.status);
      console.log('Priority:', testMessage.priority);
      console.log('Created At:', testMessage.createdAt);
    } else {
      console.log('📋 Recent messages:');
      const recentMessages = await ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(5);

      recentMessages.forEach((msg, index) => {
        console.log(`\n${index + 1}. ${msg.name} (${msg.email})`);
        console.log(`   Subject: ${msg.subject}`);
        console.log(`   Status: ${msg.status}`);
        console.log(`   Priority: ${msg.priority}`);
        console.log(`   Created: ${msg.createdAt}`);
        console.log(`   ID: ${msg._id}`);
      });
    }

    // Check by status
    console.log('\n📊 Messages by status:');
    const statuses = ['new', 'read', 'replied', 'closed'];
    for (const status of statuses) {
      const count = await ContactMessage.countDocuments({ status });
      console.log(`   ${status}: ${count}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    console.log('\n✨ Verification complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

verifyContactMessages();
