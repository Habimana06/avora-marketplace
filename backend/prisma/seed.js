import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AVORA database...');

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@avora.rw' },
    update: {},
    create: {
      email: 'admin@avora.rw',
      password: passwordHash,
      firstName: 'Admin',
      lastName: 'AVORA',
      role: 'ADMINISTRATOR',
      phone: '+250788000001',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@avora.rw' },
    update: {},
    create: {
      email: 'customer@avora.rw',
      password: passwordHash,
      firstName: 'Jean',
      lastName: 'Mugisha',
      role: 'CUSTOMER',
      phone: '+250788000002',
      loyaltyPoints: 250,
    },
  });

  const workshop = await prisma.user.upsert({
    where: { email: 'workshop@avora.rw' },
    update: {},
    create: {
      email: 'workshop@avora.rw',
      password: passwordHash,
      firstName: 'Marie',
      lastName: 'Uwase',
      role: 'WORKSHOP',
      phone: '+250788000003',
    },
  });

  const delivery = await prisma.user.upsert({
    where: { email: 'delivery@avora.rw' },
    update: {},
    create: {
      email: 'delivery@avora.rw',
      password: passwordHash,
      firstName: 'Patrick',
      lastName: 'Niyonsaba',
      role: 'DELIVERY',
      phone: '+250788000004',
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'outerwear' },
      update: {},
      create: { name: 'Outerwear', slug: 'outerwear', description: 'Premium coats and jackets' },
    }),
    prisma.category.upsert({
      where: { slug: 'tailoring' },
      update: {},
      create: { name: 'Tailoring', slug: 'tailoring', description: 'Bespoke and ready-to-wear' },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: { name: 'Accessories', slug: 'accessories', description: 'Luxury accessories' },
    }),
  ]);

  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'executive' },
      update: {},
      create: {
        name: 'Executive Collection',
        slug: 'executive',
        description: 'Refined pieces for the modern leader',
        isFeatured: true,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports Collection',
        slug: 'sports',
        description: 'Performance luxury for the active elite',
        isFeatured: true,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'heritage' },
      update: {},
      create: {
        name: 'Heritage Collection',
        slug: 'heritage',
        description: 'Made in Rwanda — crafted with pride',
        isFeatured: true,
      },
    }),
  ]);

  const products = [
    {
      name: 'Kigali Executive Blazer',
      slug: 'kigali-executive-blazer',
      description: 'Hand-tailored blazer crafted from premium Italian wool. A statement of precision and African luxury.',
      fabric: '100% Italian Wool',
      care: 'Dry clean only. Store on padded hanger.',
      shipping: 'Complimentary delivery within Kigali. 3-5 days nationwide.',
      price: 485000,
      comparePrice: 550000,
      sku: 'AV-BLZ-001',
      images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'],
      colors: ['#0D0D0D', '#174A8B', '#0F5E4B'],
      sizes: ['S', 'M', 'L', 'XL'],
      isFeatured: true,
      isNew: true,
      categoryId: categories[1].id,
      collectionId: collections[0].id,
      quantity: 24,
    },
    {
      name: 'Virunga Performance Jacket',
      slug: 'virunga-performance-jacket',
      description: 'Engineered for movement. Water-resistant shell with breathable luxury lining.',
      fabric: 'Technical Nylon Blend',
      care: 'Machine wash cold. Hang dry.',
      shipping: 'Express delivery available.',
      price: 320000,
      sku: 'AV-JKT-002',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
      colors: ['#0D0D0D', '#909090'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      isFeatured: true,
      categoryId: categories[0].id,
      collectionId: collections[1].id,
      quantity: 18,
    },
    {
      name: 'Heritage Silk Shirt',
      slug: 'heritage-silk-shirt',
      description: 'Rwandan-inspired patterns on pure silk. Each piece tells a story of craftsmanship.',
      fabric: '100% Mulberry Silk',
      care: 'Hand wash cold. Iron on low heat.',
      shipping: 'Gift packaging included.',
      price: 195000,
      sku: 'AV-SHT-003',
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'],
      colors: ['#F7F5F2', '#B8892D', '#0F5E4B'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isNew: true,
      categoryId: categories[1].id,
      collectionId: collections[2].id,
      quantity: 32,
    },
    {
      name: 'Gold Line Leather Belt',
      slug: 'gold-line-leather-belt',
      description: 'Full-grain leather with brushed gold hardware. The finishing touch.',
      fabric: 'Full-Grain Leather',
      care: 'Condition with leather cream quarterly.',
      shipping: 'Standard delivery 2-4 days.',
      price: 85000,
      sku: 'AV-BLT-004',
      images: ['https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&q=80'],
      colors: ['#0D0D0D', '#B8892D'],
      sizes: ['80', '85', '90', '95', '100'],
      categoryId: categories[2].id,
      quantity: 45,
    },
    {
      name: 'Lake Kivu Linen Trousers',
      slug: 'lake-kivu-linen-trousers',
      description: 'Relaxed luxury in premium European linen. Perfect drape, effortless elegance.',
      fabric: '100% European Linen',
      care: 'Machine wash gentle. Line dry.',
      shipping: 'Complimentary hemming service.',
      price: 165000,
      sku: 'AV-TRS-005',
      images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a7a?w=800&q=80'],
      colors: ['#F7F5F2', '#0D0D0D', '#174A8B'],
      sizes: ['28', '30', '32', '34', '36', '38'],
      isFeatured: true,
      categoryId: categories[1].id,
      collectionId: collections[0].id,
      quantity: 20,
    },
    {
      name: 'Rwanda Crest Pocket Square',
      slug: 'rwanda-crest-pocket-square',
      description: 'Hand-embroidered silk pocket square featuring the AVORA crest.',
      fabric: 'Silk Twill',
      care: 'Dry clean recommended.',
      shipping: 'Included with orders over 100,000 RWF.',
      price: 45000,
      sku: 'AV-ACC-006',
      images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80'],
      colors: ['#B8892D', '#0F5E4B', '#174A8B'],
      sizes: ['One Size'],
      categoryId: categories[2].id,
      collectionId: collections[2].id,
      quantity: 60,
    },
  ];

  for (const p of products) {
    const { quantity, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        inventory: { create: { quantity } },
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'AVORAWELCOME' },
    update: {},
    create: {
      code: 'AVORAWELCOME',
      description: 'Welcome discount for new customers',
      discountType: 'percentage',
      discountValue: 10,
      minOrder: 50000,
      maxUses: 1000,
    },
  });

  await prisma.setting.upsert({
    where: { key: 'site' },
    update: {},
    create: {
      key: 'site',
      value: {
        name: 'AVORA',
        tagline: 'African Luxury. Engineered Elegance.',
        currency: 'RWF',
        country: 'Rwanda',
      },
    },
  });

  console.log('Seed complete.');
  console.log('Demo accounts (password: Password123!):');
  console.log('  Admin:      admin@avora.rw');
  console.log('  Customer:   customer@avora.rw');
  console.log('  Workshop:   workshop@avora.rw');
  console.log('  Delivery:   delivery@avora.rw');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
