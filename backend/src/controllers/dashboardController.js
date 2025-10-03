import Campaign from '../models/Campaign.js'
import Lead from '../models/Lead.js'

export const getDashboardMetrics = async (req, res) => {
  const { startDate, endDate } = req.query
  const match = {}
  if (startDate || endDate) {
    match.createdAt = {}
    if (startDate) {
      match.createdAt.$gte = new Date(startDate)
    }
    if (endDate) {
      match.createdAt.$lte = new Date(endDate)
    }
  }

  const timeSeries = await Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalLeads: { $sum: 1 },
        convertedLeads: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const totals = timeSeries.reduce((acc, day) => {
    acc.totalLeads += day.totalLeads
    acc.convertedLeads += day.convertedLeads
    return acc
  }, { totalLeads: 0, convertedLeads: 0 })
  totals.conversionRate = totals.totalLeads === 0 ? 0 : (totals.convertedLeads / totals.totalLeads) * 100

  const campaignStats = await Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$sourceCampaign',
        totalLeads: { $sum: 1 },
        convertedLeads: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0]
          }
        }
      }
    }
  ])

  const campaignMap = campaignStats.reduce((acc, stat) => {
    acc[stat._id?.toString() ?? 'unknown'] = stat
    return acc
  }, {})

  const campaigns = await Campaign.find().select('name cost type startDate metrics')

  const campaignMetrics = campaigns.map(campaign => {
    const stat = campaignMap[campaign._id.toString()] || { totalLeads: 0, convertedLeads: 0 }
    const cpl = stat.totalLeads === 0 ? null : campaign.cost / stat.totalLeads
    const cpa = stat.convertedLeads === 0 ? null : campaign.cost / stat.convertedLeads
    return {
      id: campaign._id,
      name: campaign.name,
      type: campaign.type,
      startDate: campaign.startDate,
      cost: campaign.cost,
      metrics: campaign.metrics,
      totalLeads: stat.totalLeads,
      convertedLeads: stat.convertedLeads,
      cpl,
      cpa
    }
  })

  const rankedCampaigns = [...campaignMetrics].sort((a, b) => {
    const aCpl = a.cpl ?? Number.POSITIVE_INFINITY
    const bCpl = b.cpl ?? Number.POSITIVE_INFINITY
    if (aCpl === bCpl) {
      return (b.convertedLeads || 0) - (a.convertedLeads || 0)
    }
    return aCpl - bCpl
  })

  res.json({
    timeSeries: timeSeries.map(day => ({
      date: day._id,
      totalLeads: day.totalLeads,
      conversionRate: day.totalLeads === 0 ? 0 : (day.convertedLeads / day.totalLeads) * 100
    })),
    totals,
    campaignMetrics,
    rankedCampaigns
  })
}
