import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const ranges = {
  last7: { label: 'Last 7 days', days: 7 },
  last30: { label: 'Last 30 days', days: 30 },
  quarter: { label: 'Last 90 days', days: 90 }
}

const DashboardPage = () => {
  const [range, setRange] = useState('last30')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const params = useMemo(() => {
    const { days } = ranges[range]
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    }
  }, [range])

  const loadMetrics = async () => {
    setLoading(true)
    try {
      const { data: metrics } = await api.get('/dashboard/metrics', { params })
      setData(metrics)
    } catch (error) {
      toast.error(error.message || 'Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [range])

  if (loading && !data) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {Object.entries(ranges).map(([key, value]) => (
          <Button key={key} variant={range === key ? 'default' : 'secondary'} onClick={() => setRange(key)}>
            {value.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
            <CardDescription>All leads captured in the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totals.totalLeads ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Converted Leads</CardTitle>
            <CardDescription>Number of leads that converted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totals.convertedLeads ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Percentage of leads converted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(data?.totals.conversionRate ?? 0).toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Growth & Conversion</CardTitle>
          <CardDescription>Visualize lead generation performance over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <Spinner />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.timeSeries || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                />
                <Line type="monotone" yAxisId="left" dataKey="totalLeads" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" yAxisId="right" dataKey="conversionRate" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Cost efficiency and conversions by campaign.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {data?.campaignMetrics?.map(campaign => {
              const cost = Number(campaign.cost ?? 0)
              return (
                <div key={campaign.id} className="rounded-lg border bg-background p-4 shadow-sm">
                  <div className="text-sm font-semibold">{campaign.name}</div>
                  <div className="text-xs text-muted-foreground">{campaign.type}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="text-right font-medium">${cost.toLocaleString()}</span>
                    <span className="text-muted-foreground">Leads</span>
                    <span className="text-right font-medium">{campaign.totalLeads}</span>
                    <span className="text-muted-foreground">Converted</span>
                    <span className="text-right font-medium">{campaign.convertedLeads}</span>
                    <span className="text-muted-foreground">CPL</span>
                    <span className="text-right font-medium">{campaign.cpl ? `$${campaign.cpl.toFixed(2)}` : '—'}</span>
                    <span className="text-muted-foreground">CPA</span>
                    <span className="text-right font-medium">{campaign.cpa ? `$${campaign.cpa.toFixed(2)}` : '—'}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Top Campaigns by CPL</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Converted</TableHead>
                  <TableHead>CPL</TableHead>
                  <TableHead>CPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.rankedCampaigns?.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell>{campaign.name}</TableCell>
                    <TableCell>{campaign.totalLeads}</TableCell>
                    <TableCell>{campaign.convertedLeads}</TableCell>
                    <TableCell>{campaign.cpl ? `$${campaign.cpl.toFixed(2)}` : '—'}</TableCell>
                    <TableCell>{campaign.cpa ? `$${campaign.cpa.toFixed(2)}` : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
