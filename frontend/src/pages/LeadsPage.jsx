import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Spinner } from '../components/ui/spinner'
import api from '../services/api'

const statuses = ['New', 'In Progress', 'Converted', 'Lost']

const defaultForm = {
  fullName: '',
  phone: '',
  email: '',
  status: 'New',
  notes: '',
  sourceCampaign: ''
}

const LeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)

  const loadData = async () => {
    setLoading(true)
    try {
      const [leadsRes, campaignsRes] = await Promise.all([
        api.get('/leads'),
        api.get('/campaigns')
      ])
      setLeads(leadsRes.data)
      setCampaigns(campaignsRes.data)
    } catch (error) {
      toast.error(error.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpen = (lead = null) => {
    setEditing(lead)
    if (lead) {
      setForm({
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email || '',
        status: lead.status,
        notes: lead.notes || '',
        sourceCampaign: lead.sourceCampaign?._id || ''
      })
    } else {
      setForm(defaultForm)
    }
    setOpen(true)
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (!payload.sourceCampaign) delete payload.sourceCampaign

      if (editing) {
        await api.put(`/leads/${editing._id}`, payload)
        toast.success('Lead updated')
      } else {
        await api.post('/leads', payload)
        toast.success('Lead created')
      }
      setOpen(false)
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to save lead')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return
    try {
      await api.delete(`/leads/${id}`)
      toast.success('Lead deleted')
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to delete lead')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Leads</h2>
          <p className="text-sm text-muted-foreground">Capture and nurture prospects effectively.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen(null)}>
              <Plus className="mr-2 h-4 w-4" /> New Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Lead' : 'Create Lead'}</DialogTitle>
              <DialogDescription>Provide the lead details below.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required value={form.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceCampaign">Source Campaign</Label>
                <select
                  id="sourceCampaign"
                  name="sourceCampaign"
                  value={form.sourceCampaign}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">None</option>
                  {campaigns.map(campaign => (
                    <option key={campaign._id} value={campaign._id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} />
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editing ? 'Save changes' : 'Create lead'}</Button>
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
              <TableHead>Full Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source Campaign</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map(lead => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">{lead.fullName}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.email || '—'}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>{lead.sourceCampaign?.name || '—'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpen(lead)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(lead._id)}>
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

export default LeadsPage
