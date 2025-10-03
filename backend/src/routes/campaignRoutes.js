import { Router } from 'express'
import { createCampaign, deleteCampaign, getCampaigns, updateCampaign } from '../controllers/campaignController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

router.get('/', getCampaigns)
router.post('/', createCampaign)
router.put('/:id', updateCampaign)
router.delete('/:id', deleteCampaign)

export default router
