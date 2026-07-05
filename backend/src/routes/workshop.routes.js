import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { logAction } from '../utils/logger.js';

const router = Router();

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

router.get('/stats', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const userId = req.user.id;
    const [pending, inProgress, qualityCheck, completed, myProducts, pendingApproval, totalOrders] = await Promise.all([
      prisma.production.count({ where: { status: 'PENDING' } }),
      prisma.production.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.production.count({ where: { status: 'QUALITY_CHECK' } }),
      prisma.production.count({ where: { status: 'COMPLETED' } }),
      prisma.product.count({ where: { createdById: userId } }),
      prisma.product.count({ where: { createdById: userId, approvalStatus: 'PENDING' } }),
      prisma.order.count({ where: { status: { in: ['CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY'] } } }),
    ]);

    res.json({
      stats: {
        pending,
        inProgress,
        qualityCheck,
        completed,
        myProducts,
        pendingApproval,
        totalOrders,
        approvedProducts: await prisma.product.count({ where: { createdById: userId, approvalStatus: 'APPROVED' } }),
        rejectedProducts: await prisma.product.count({ where: { createdById: userId, approvalStatus: 'REJECTED' } }),
      },
    });
  } catch (err) {
    console.error('Workshop stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/queue', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = { status: { in: ['CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY'] } };
    if (search) {
      where.OR = [{ orderNumber: { contains: search } }];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        production: true,
        user: { select: { firstName: true, lastName: true, email: true } },
        address: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const filtered = status
      ? orders.filter((o) => (o.production?.status || 'PENDING') === status)
      : orders;

    res.json({ orders: filtered });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

router.get('/orders/:orderId', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: {
        items: { include: { product: { include: { category: true, collection: true } } } },
        production: true,
        payment: true,
        address: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.put('/production/:orderId', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const orderItem = await prisma.orderItem.findFirst({ where: { orderId: req.params.orderId } });

    const production = await prisma.production.upsert({
      where: { orderId: req.params.orderId },
      update: {
        status,
        notes,
        ...(status === 'IN_PROGRESS' && { startedAt: new Date() }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
      create: {
        orderId: req.params.orderId,
        productId: orderItem.productId,
        status,
        notes,
        startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
      },
    });

    const orderStatus = status === 'COMPLETED' ? 'READY'
      : status === 'IN_PROGRESS' ? 'IN_PRODUCTION'
      : status === 'QUALITY_CHECK' ? 'QUALITY_CHECK'
      : 'CONFIRMED';

    await prisma.order.update({
      where: { id: req.params.orderId },
      data: { status: orderStatus },
    });

    await logAction(req.user.id, 'PRODUCTION_STATUS_UPDATED', 'production', req.params.orderId, { status });
    res.json({ production });
  } catch (err) {
    console.error('Production update error:', err);
    res.status(500).json({ error: 'Failed to update production status' });
  }
});

router.get('/products', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = { createdById: req.user.id };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { slug: { contains: search } },
      ];
    }
    if (status) where.approvalStatus = status;

    const products = await prisma.product.findMany({
      where,
      include: { category: true, collection: true, inventory: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/products/:id', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, createdById: req.user.id },
      include: { category: true, collection: true, inventory: true },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/products', authenticate, authorize(['WORKSHOP']), async (req, res) => {
  try {
    const {
      name, description, fabric, care, shipping, price, comparePrice, sku,
      images, colors, sizes, categoryId, collectionId, quantity,
    } = req.body;

    const slug = slugify(name) + '-' + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        fabric,
        care,
        shipping,
        price,
        comparePrice,
        sku: sku || `WS-${Date.now().toString().slice(-6)}`,
        images: images || [],
        colors: colors || ['#0D0D0D'],
        sizes: sizes || ['S', 'M', 'L', 'XL'],
        categoryId,
        collectionId: collectionId || null,
        createdById: req.user.id,
        approvalStatus: 'PENDING',
        isActive: false,
        inventory: { create: { quantity: quantity || 0 } },
      },
      include: { category: true, collection: true, inventory: true },
    });

    await logAction(req.user.id, 'WORKSHOP_PRODUCT_CREATED', 'product', product.id);
    res.status(201).json({ product });
  } catch (err) {
    console.error('Workshop product create error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', authenticate, authorize(['WORKSHOP']), async (req, res) => {
  try {
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, createdById: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { quantity, ...data } = req.body;
    delete data.approvalStatus;
    delete data.isActive;
    delete data.createdById;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...data,
        approvalStatus: 'PENDING',
        isActive: false,
      },
      include: { category: true, collection: true, inventory: true },
    });

    if (quantity !== undefined) {
      await prisma.inventory.upsert({
        where: { productId: product.id },
        update: { quantity },
        create: { productId: product.id, quantity },
      });
    }

    await logAction(req.user.id, 'WORKSHOP_PRODUCT_UPDATED', 'product', product.id);
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', authenticate, authorize(['WORKSHOP']), async (req, res) => {
  try {
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, createdById: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await prisma.product.delete({ where: { id: req.params.id } });
    await logAction(req.user.id, 'WORKSHOP_PRODUCT_DELETED', 'product', req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

router.get('/reports', authenticate, authorize(['WORKSHOP', 'ADMINISTRATOR']), async (req, res) => {
  try {
    const userId = req.user.id;
    const [products, productions, recentOrders] = await Promise.all([
      prisma.product.groupBy({
        by: ['approvalStatus'],
        where: { createdById: userId },
        _count: true,
      }),
      prisma.production.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.order.findMany({
        where: { status: { in: ['CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY', 'DELIVERED'] } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { orderNumber: true, status: true, total: true, createdAt: true },
      }),
    ]);

    res.json({ products, productions, recentOrders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

router.get('/meta/categories', authenticate, authorize(['WORKSHOP']), async (_req, res) => {
  try {
    const [categories, collections] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
      prisma.collection.findMany({ orderBy: { name: 'asc' } }),
    ]);
    res.json({ categories, collections });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load metadata' });
  }
});

export default router;
