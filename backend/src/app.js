import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import campaignRoutes from './routes/campaignRoutes.js'
import leadRoutes from './routes/leadRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
