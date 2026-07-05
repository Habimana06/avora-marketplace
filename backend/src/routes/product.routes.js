import { Router } from 'express';
import prisma from '../config/database.js';
import { cacheGet, cacheSet } from '../config/redis.js';

const router = Router();

router.get('/meta/filters', async (_req, res) => {
  try {
    const [categories, collections] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
      prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    ]);

    const priceStats = await prisma.product.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true },
    });

    res.json({
      categories,
      collections,
      priceRange: {
        min: Number(priceStats._min.price || 0),
        max: Number(priceStats._max.price || 500000),
      },
    });
  } catch (err) {
    console.error('Filter meta error:', err);
    res.status(500).json({ error: 'Failed to load filters' });
  }
});

router.get('/', async (req, res) => {
  try {
    const {
      category,
      collection,
      minPrice,
      maxPrice,
      sort = 'newest',
      featured,
      search,
    } = req.query;

    const where = { isActive: true, approvalStatus: 'APPROVED' };

    if (category) where.category = { slug: category };
    if (collection) where.collection = { slug: collection };
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy =
      sort === 'price-asc'
        ? { price: 'asc' }
        : sort === 'price-desc'
          ? { price: 'desc' }
          : sort === 'name'
            ? { name: 'asc' }
            : { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true, collection: true, inventory: true },
      orderBy,
      take: 100,
    });

    res.json({ products, count: products.length });
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, isActive: true, approvalStatus: 'APPROVED' },
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
