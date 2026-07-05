import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAction } from '../utils/logger.js'

const router = Router()

router.get('/stats', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const [orders, revenue, products, users] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count(),
      prisma.user.count(),
    ])

    res.json({
      stats: {
        orders,
        revenue: revenue._sum.total || 0,
        products,
        users,
      }
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

router.get('/users', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true }
    })
    res.json({ users })
  } catch {
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
  } catch {
    res.status(500).json({ error: 'Failed to update user role' })
  }
})

router.get('/products', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, collection: true, inventory: true }
    })
    res.json({ products })
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

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
  } catch {
    res.status(500).json({ error: 'Failed to create product' })
  }
})

router.put('/products/:id/approve', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { approvalStatus: 'APPROVED', isActive: true },
      include: { category: true, collection: true, inventory: true },
    });
    await logAction(req.user.id, 'PRODUCT_APPROVED', 'product', product.id);
    res.json({ product });
  } catch {
    res.status(500).json({ error: 'Failed to approve product' });
  }
});

router.put('/products/:id/reject', authenticate, authorize(['ADMINISTRATOR']), async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { approvalStatus: 'REJECTED', isActive: false },
    });
    await logAction(req.user.id, 'PRODUCT_REJECTED', 'product', product.id);
    res.json({ product });
  } catch {
    res.status(500).json({ error: 'Failed to reject product' });
  }
});

router.get('/products/pending', authenticate, authorize(['ADMINISTRATOR']), async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { approvalStatus: 'PENDING' },
      include: { category: true, collection: true, inventory: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ products });
  } catch {
    res.status(500).json({ error: 'Failed to fetch pending products' });
  }
});

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
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

export default router