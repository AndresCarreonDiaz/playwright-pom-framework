import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string(),
  price: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
});

export const productListSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

export const loginResponseSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const errorSchema = z.object({ message: z.string() });

export type Product = z.infer<typeof productSchema>;
