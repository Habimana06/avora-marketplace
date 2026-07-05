import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAction } from '../utils/logger.js'

const router = Router()

router.get('/assigned', authenticate, authorize(['DELIVERY', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      where: req.user.role === 'ADMINISTRATOR' 
        ? {} 
        : { agentId: req.user.id },
      include: { order: { include: { items: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ deliveries })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' })
  }
})

router.put('/:orderId/status', authenticate, authorize(['DELIVERY', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const { status, proofImage, notes } = req.body
    
    const delivery = await prisma.delivery.update({
      where: { orderId: req.params.orderId },
      data: { status, proofImage, notes },
    })

    if (status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: req.params.orderId },
        data: { status: 'DELIVERED' },
      })
    }

    await logAction(req.user.id, 'DELIVERY_STATUS_UPDATED', 'delivery', req.params.orderId, { status })

    res.json({ delivery })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery status' })
  }
})

export default router