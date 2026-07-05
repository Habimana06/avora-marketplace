import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAction } from '../utils/logger.js'

const router = Router()

const VALID_PAYMENT_METHODS = ['MTN_MOMO', 'AIRTEL_MONEY', 'VISA', 'MASTERCARD', 'STRIPE']

router.get('/my-orders', authenticate, authorize(['CUSTOMER']), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: true } },
        payment: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

router.post('/', authenticate, authorize(['CUSTOMER']), async (req, res) => {
  try {
    const { addressId: bodyAddressId, address, items, paymentMethod } = req.body

    if (!items?.length) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ error: 'Please select a valid payment method' })
    }

    let addressId = bodyAddressId

    if (!addressId && address) {
      const created = await prisma.address.create({
        data: {
          userId: req.user.id,
          label: address.label || 'Home',
          street: address.street,
          city: address.city,
          state: address.state || null,
          postalCode: address.postalCode || null,
          country: address.country || 'Rwanda',
          isDefault: true,
        },
      })
      addressId = created.id
    }

    if (!addressId) {
      const existing = await prisma.address.findFirst({
        where: { userId: req.user.id },
        orderBy: { isDefault: 'desc' },
      })
      addressId = existing?.id
    }

    if (!addressId) {
      return res.status(400).json({ error: 'Delivery address is required' })
    }

    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { inventory: true },
      })

      if (!product) {
        return res.status(400).json({ error: 'Product not found' })
      }

      const available = product.inventory?.quantity ?? 100

      if (available < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
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
        status: 'CONFIRMED',
        items: { create: orderItems },
        payment: {
          create: {
            method: paymentMethod,
            status: 'COMPLETED',
            amount: subtotal,
            transactionId: `TXN-${Date.now()}`,
          },
        },
      },
      include: { items: { include: { product: true } }, payment: true, address: true },
    })

    for (const item of orderItems) {
      await prisma.production.upsert({
        where: { orderId: order.id },
        update: {},
        create: {
          orderId: order.id,
          productId: item.productId,
          status: 'PENDING',
        },
      })

      if (await prisma.inventory.findUnique({ where: { productId: item.productId } })) {
        await prisma.inventory.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        })
      }
    }

    await logAction(req.user.id, 'ORDER_CREATED', 'order', order.id)

    res.status(201).json({ order })
  } catch (err) {
    console.error('Order creation failed:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

export default router
