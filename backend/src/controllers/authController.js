import User from '../models/User.js'
import { generateToken } from '../utils/token.js'

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Full name, email and password are required' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const user = await User.create({ fullName, email, password, role })
  const token = generateToken(user)
  res.status(201).json({
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    token
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user)
  res.json({
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    token
  })
}

export const getProfile = async (req, res) => {
  res.json({ user: req.user })
}
