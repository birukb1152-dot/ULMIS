import mongoose from 'mongoose'

const infraReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  issueType: {
    type: String,
    required: true,
    enum: ['Road Damage', 'Water Supply', 'Street Light', 'Sewage', 'Electricity', 'Garbage', 'Flooding', 'Other'],
  },
  location:    { type: String, required: true },
  description: { type: String, required: true },
  reportDate:  { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  officerNote: { type: String, default: '' },
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })

// Auto-generate reportId
infraReportSchema.pre('save', async function (next) {
  if (!this.reportId) {
    const count = await mongoose.model('InfraReport').countDocuments()
    this.reportId = `IR-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

export default mongoose.model('InfraReport', infraReportSchema)
