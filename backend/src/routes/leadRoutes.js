import { Router } from 'express'
import { createLead, deleteLead, getLeads, updateLead } from '../controllers/leadController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

router.get('/', getLeads)
router.post('/', createLead)
router.put('/:id', updateLead)
router.delete('/:id', deleteLead)

export default router
