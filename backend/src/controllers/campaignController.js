import Campaign from '../models/Campaign.js'

export const getCampaigns = async (req, res) => {
  const campaigns = await Campaign.find().populate('owner', 'fullName email role').sort({ createdAt: -1 })
  res.json(campaigns)
}

export const createCampaign = async (req, res) => {
  const payload = { ...req.body, owner: req.user._id }
  const campaign = await Campaign.create(payload)
  res.status(201).json(campaign)
}

export const updateCampaign = async (req, res) => {
  const { id } = req.params
  const campaign = await Campaign.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' })
  }
  res.json(campaign)
}

export const deleteCampaign = async (req, res) => {
  const { id } = req.params
  const campaign = await Campaign.findByIdAndDelete(id)
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' })
  }
  res.json({ message: 'Campaign deleted' })
}
