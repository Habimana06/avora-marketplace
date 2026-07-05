import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAction } from '../utils/logger.js'

const router = Router()

// Get dashboard stats
router.get('/stats', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count(),
      prisma.user.count(),
    ])

    res.json({
      stats: {
        orders: totalOrders,
        revenue: totalRevenue._sum.total || 0,
        products: totalProducts,
        users: totalUsers,
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// User management
router.get('/users', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true }
    })
    res.json({ users })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.put('/users/:userId/role', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const { role } = req.body
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true }
    })
    await logAction(req.user.id, 'USER_ROLE_UPDATED', 'user', req.params.userId, { role })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' })
  }
})

// Product management
router.post('/products', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const { 
      name, slug, description, fabric, care, shipping, 
      price, comparePrice, sku, images, colors, sizes,
      categoryId, collectionId 
    } = req.body

    const product = await prisma.product.create({
      data: {
        name, slug, description, fabric, care, shipping,
        price, comparePrice, sku, images, colors, sizes,
        categoryId, collectionId,
        inventory: { create: { quantity: 0 } },
      },
      include: { category: true, collection: true, inventory: true }
    })

    await logAction(req.user.id, 'PRODUCT_CREATED', 'product', product.id)
    res.status(201).json({ product })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Order management
router.get('/orders', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: true, 
        items: true, 
        payment: true,
        production: true,
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    const safeOrders = orders.map(o => ({ ...o, user: { ...o.user, password: undefined } }))
    res.json({ orders: safeOrders })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

export default router