import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAction } from '../utils/logger.js'

const router = Router()

// Get all orders for workshop queue
router.get('/queue', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        status: { in: ['CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY'] }
      },
      include: { 
        items: { include: { product: true } },
        production: true,
      },
      orderBy: { createdAt: 'asc' },
    })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch queue' })
  }
})

// Update production status
router.put('/production/:orderId', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const { status, notes } = req.body
    
    const production = await prisma.production.upsert({
      where: { orderId: req.params.orderId },
      update: { status, notes },
      create: {
        orderId: req.params.orderId,
        productId: (await prisma.orderItem.findFirst({ where: { orderId: req.params.orderId } })).productId,
        status,
        notes,
      },
    })

    if (status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: req.params.orderId },
        data: { status: 'READY' },
      })
    }

    await logAction(req.user.id, 'PRODUCTION_STATUS_UPDATED', 'production', req.params.orderId, { status })

    res.json({ production })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update production status' })
  }
})

export default router