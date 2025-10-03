import Lead from '../models/Lead.js'

export const getLeads = async (req, res) => {
  const leads = await Lead.find().populate('sourceCampaign').sort({ createdAt: -1 })
  res.json(leads)
}

const sanitizeLeadPayload = (body) => {
  const payload = { ...body }
  if (typeof payload.fullName === 'string') {
    payload.fullName = payload.fullName.trim()
  }
  if (typeof payload.phone === 'string') {
    payload.phone = payload.phone.trim()
  }
  if (typeof payload.email === 'string') {
    payload.email = payload.email.trim()
    if (payload.email.length === 0) {
      delete payload.email
    }
  }
  if (typeof payload.notes === 'string' && payload.notes.trim().length === 0) {
    delete payload.notes
  }
  if (!payload.sourceCampaign) {
    delete payload.sourceCampaign
  }
  return payload
}

export const createLead = async (req, res) => {
  const payload = sanitizeLeadPayload(req.body)

  const duplicate = await Lead.findOne({ phone: payload.phone })
  if (duplicate) {
    return res.status(409).json({ message: 'A lead with this phone already exists' })
  }

  try {
    const lead = await Lead.create(payload)
    res.status(201).json(lead)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A lead with this phone already exists' })
    }
    throw error
  }
}

export const updateLead = async (req, res) => {
  const { id } = req.params
  const payload = sanitizeLeadPayload(req.body)

  if (payload.phone) {
    const duplicate = await Lead.findOne({ phone: payload.phone, _id: { $ne: id } })
    if (duplicate) {
      return res.status(409).json({ message: 'A lead with this phone already exists' })
    }
  }

  try {
    const lead = await Lead.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' })
    }
    res.json(lead)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A lead with this phone already exists' })
    }
    throw error
  }
}

export const deleteLead = async (req, res) => {
  const { id } = req.params
  const lead = await Lead.findByIdAndDelete(id)
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found' })
  }
  res.json({ message: 'Lead deleted' })
}
