import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize(['CUSTOMER']), async (req, res) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: { include: { category: true, collection: true, inventory: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/:productId', authenticate, authorize(['CUSTOMER']), async (req, res) => {
  try {
    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId: req.user.id, productId: req.params.productId },
      },
      update: {},
      create: { userId: req.user.id, productId: req.params.productId },
      include: { product: true },
    });
    res.status(201).json({ item });
  } catch {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

router.delete('/:productId', authenticate, authorize(['CUSTOMER']), async (req, res) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    res.json({ message: 'Removed from wishlist' });
  } catch {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
