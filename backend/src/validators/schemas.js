import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().optional(),
  collection: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'best_selling']).default('newest'),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  featured: z.coerce.boolean().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});

export const productionUpdateSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'QUALITY_CHECK', 'COMPLETED']),
  notes: z.string().optional(),
});

export const deliveryUpdateSchema = z.object({
  status: z.enum(['ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED']),
  notes: z.string().optional(),
  proofImage: z.string().url().optional(),
});
