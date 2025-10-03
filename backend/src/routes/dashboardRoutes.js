import { Router } from 'express'
import { getDashboardMetrics } from '../controllers/dashboardController.js'
import { authenticate, authorizeRoles } from '../middleware/auth.js'

const router = Router()

router.use(authenticate, authorizeRoles('Admin'))

router.get('/metrics', getDashboardMetrics)

export default router
