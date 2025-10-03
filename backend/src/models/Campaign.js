import mongoose from 'mongoose'

const metricsSchema = new mongoose.Schema({
  reach: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  }
}, { _id: false })

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  metrics: {
    type: metricsSchema,
    default: () => ({})
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

const Campaign = mongoose.model('Campaign', campaignSchema)

export default Campaign
