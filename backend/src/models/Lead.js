import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Converted', 'Lost'],
    default: 'New'
  },
  notes: {
    type: String,
    trim: true
  },
  sourceCampaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }
}, { timestamps: true })

leadSchema.index({ phone: 1 }, { unique: true })

const Lead = mongoose.model('Lead', leadSchema)

export default Lead
