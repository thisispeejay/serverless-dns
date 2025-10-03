import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Spinner } from '../components/ui/spinner'
import api from '../services/api'

const defaultForm = {
  name: '',
  type: '',
  startDate: '',
  cost: '',
  metrics: {
    reach: '',
    impressions: ''
  }
}

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(() => ({ ...defaultForm, metrics: { ...defaultForm.metrics } }))

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/campaigns')
      setCampaigns(data)
    } catch (error) {
      toast.error(error.message || 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  const handleOpen = (campaign = null) => {
    setEditing(campaign)
    if (campaign) {
      setForm({
        name: campaign.name,
        type: campaign.type,
        startDate: campaign.startDate?.slice(0, 10) || '',
        cost: campaign.cost,
        metrics: {
          reach: campaign.metrics?.reach ?? '',
          impressions: campaign.metrics?.impressions ?? ''
        }
      })
    } else {
      setForm({ ...defaultForm, metrics: { ...defaultForm.metrics } })
    }
    setOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'reach' || name === 'impressions') {
      setForm(prev => ({ ...prev, metrics: { ...prev.metrics, [name]: value } }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/campaigns/${editing._id}`, {
          ...form,
          cost: Number(form.cost),
          metrics: {
            reach: Number(form.metrics.reach),
            impressions: Number(form.metrics.impressions)
          }
        })
        toast.success('Campaign updated')
      } else {
        await api.post('/campaigns', {
          ...form,
          cost: Number(form.cost),
          metrics: {
            reach: Number(form.metrics.reach),
            impressions: Number(form.metrics.impressions)
          }
        })
        toast.success('Campaign created')
      }
      setOpen(false)
      loadCampaigns()
    } catch (error) {
      toast.error(error.message || 'Failed to save campaign')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return
    try {
      await api.delete(`/campaigns/${id}`)
      toast.success('Campaign deleted')
      loadCampaigns()
    } catch (error) {
      toast.error(error.message || 'Failed to delete campaign')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Campaigns</h2>
          <p className="text-sm text-muted-foreground">Manage marketing initiatives and optimize spend.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen(null)}>
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
              <DialogDescription>Fill in the details below to {editing ? 'update' : 'create'} a campaign.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input id="name" name="name" required value={form.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" name="type" required value={form.type} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required value={form.startDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Budget (USD)</Label>
                <Input id="cost" name="cost" type="number" step="0.01" required value={form.cost} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reach">Reach</Label>
                  <Input id="reach" name="reach" type="number" value={form.metrics.reach} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impressions">Impressions</Label>
                  <Input id="impressions" name="impressions" type="number" value={form.metrics.impressions} onChange={handleChange} />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editing ? 'Save changes' : 'Create campaign'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Reach</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map(campaign => (
              <TableRow key={campaign._id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{campaign.type}</TableCell>
                <TableCell>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '—'}</TableCell>
                <TableCell>${Number(campaign.cost ?? 0).toLocaleString()}</TableCell>
                <TableCell>{campaign.metrics?.reach ?? '—'}</TableCell>
                <TableCell>{campaign.metrics?.impressions ?? '—'}</TableCell>
                <TableCell>{campaign.owner?.fullName ?? '—'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpen(campaign)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(campaign._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default CampaignsPage
