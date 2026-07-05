import { Router } from 'express';
import prisma from '../config/database.js';
import { cacheGet, cacheSet } from '../config/redis.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const cacheKey = 'products:all';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, collection: true, inventory: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const result = { products };
    await cacheSet(cacheKey, result, 300);
    res.json(result);
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug, isActive: true },
      include: {
        category: true,
        collection: true,
        inventory: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
