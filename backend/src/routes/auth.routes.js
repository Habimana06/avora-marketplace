import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../config/database.js'
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenExpiryDays,
} from '../utils/jwt.js'
import { validate } from '../middleware/validate.js'
import { registerSchema, loginSchema } from '../validators/schemas.js'

const router = Router()

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        loyaltyPoints: true,
      },
    })

    const accessToken = generateAccessToken({ userId: user.id, role: user.role })
    const refreshToken = generateRefreshToken({ userId: user.id })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + getTokenExpiryDays())

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    })

    res.status(201).json({ user, accessToken, refreshToken })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role })
    const refreshToken = generateRefreshToken({ userId: user.id })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + getTokenExpiryDays())

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    })

    const { password: _, ...safeUser } = user
    res.json({ user: safeUser, accessToken, refreshToken })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' })
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const accessToken = generateAccessToken({
      userId: stored.user.id,
      role: stored.user.role,
    })

    res.json({ accessToken })
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.json({ message: 'Logged out successfully' })
  } catch {
    res.status(500).json({ error: 'Logout failed' })
  }
})

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.json(null)

    const jwt = await import('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'avora_jwt_secret')
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, loyaltyPoints: true }
    })
    
    res.json({ user })
  } catch {
    res.json(null)
  }
})

export default router