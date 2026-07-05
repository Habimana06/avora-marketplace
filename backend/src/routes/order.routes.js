import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAction } from '../utils/logger.js'

const router = Router()

router.get('/my-orders', authenticate, authorize(['CUSTOMER']), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

router.post('/', authenticate, authorize(['CUSTOMER']), async (req, res) => {
  try {
    const { addressId, items, couponCode } = req.body

    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { inventory: true },
      })
      
      if (!product || product.inventory.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product?.name}` })
      }
      
      subtotal += Number(product.price) * item.quantity
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color,
      })
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: `AV-${Date.now().toString().slice(-8)}`,
        userId: req.user.id,
        addressId,
        subtotal,
        total: subtotal,
        items: { create: orderItems },
      },
      include: { items: true },
    })

    await logAction(req.user.id, 'ORDER_CREATED', 'order', order.id)

    res.status(201).json({ order })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' })
  }
})

export default router