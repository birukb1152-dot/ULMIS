import mongoose from 'mongoose'

const landRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  landType: {
    type: String,
    required: true,
    enum: ['Residential', 'Commercial', 'Agricultural', 'Industrial', 'Mixed Use'],
  },
  size:     { type: String, required: true },
  location: { type: String, required: true },
  purpose:  { type: String, required: true },
  applicationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  landId:      { type: String, default: null },
  officerNote: { type: String, default: '' },
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })

// Auto-generate requestId before save
landRequestSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.model('LandRequest').countDocuments()
    this.requestId = `LR-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

export default mongoose.model('LandRequest', landRequestSchema)
