import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }
    const payload = jwt.verify(token, secret)
    const user = await User.findById(payload.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' })
  }
  next()
}
