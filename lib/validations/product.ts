import { z } from 'zod';
import { AttributeType } from '@/types/product';

// Step 1: Basic Information
export const productBasicInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name must be less than 200 characters'),
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional()
    .or(z.literal('')),
  shortDescription: z
    .string()
    .max(500, 'Short description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  categoryId: z.string().uuid('Invalid category').optional().or(z.literal('')),
  sku: z
    .string()
    .max(100, 'SKU must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  barcode: z
    .string()
    .max(100, 'Barcode must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

export type ProductBasicInfoFormData = z.infer<typeof productBasicInfoSchema>;

// Step 2: Pricing & Inventory
export const productPricingSchema = z.object({
  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price is too high'),
  compareAtPrice: z
    .number()
    .positive('Compare at price must be greater than 0')
    .max(999999.99, 'Compare at price is too high')
    .optional()
    .refine(
      (val, ctx) => {
        const price = ctx.parent.price;
        return !val || val > price;
      },
      {
        message: 'Compare at price must be greater than regular price',
      }
    ),
  costPrice: z
    .number()
    .positive('Cost price must be greater than 0')
    .max(999999.99, 'Cost price is too high')
    .optional(),
  stockQuantity: z
    .number()
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative'),
  lowStockThreshold: z
    .number()
    .int('Low stock threshold must be a whole number')
    .min(0, 'Low stock threshold cannot be negative')
    .optional(),
  trackInventory: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
});

export type ProductPricingFormData = z.infer<typeof productPricingSchema>;

// Step 3: Shipping & Physical Attributes
export const productShippingSchema = z.object({
  isDigital: z.boolean().default(false),
  requiresShipping: z.boolean().default(true),
  weight: z
    .number()
    .positive('Weight must be greater than 0')
    .max(9999.99, 'Weight is too high')
    .optional()
    .refine(
      (val, ctx) => {
        const requiresShipping = ctx.parent.requiresShipping;
        return !requiresShipping || (val !== undefined && val > 0);
      },
      {
        message: 'Weight is required for products requiring shipping',
      }
    ),
  length: z
    .number()
    .positive('Length must be greater than 0')
    .max(9999.99, 'Length is too high')
    .optional(),
  width: z
    .number()
    .positive('Width must be greater than 0')
    .max(9999.99, 'Width is too high')
    .optional(),
  height: z
    .number()
    .positive('Height must be greater than 0')
    .max(9999.99, 'Height is too high')
    .optional(),
});

export type ProductShippingFormData = z.infer<typeof productShippingSchema>;

// Step 4: SEO & Metadata
export const productSeoSchema = z.object({
  metaTitle: z
    .string()
    .max(200, 'Meta title must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  metaDescription: z
    .string()
    .max(500, 'Meta description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  metaKeywords: z
    .string()
    .max(500, 'Meta keywords must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

export type ProductSeoFormData = z.infer<typeof productSeoSchema>;

// Product Attribute Schema
export const productAttributeSchema = z.object({
  name: z
    .string()
    .min(1, 'Attribute name is required')
    .max(100, 'Attribute name must be less than 100 characters'),
  value: z
    .string()
    .min(1, 'Attribute value is required')
    .max(500, 'Attribute value must be less than 500 characters'),
  type: z.nativeEnum(AttributeType).default(AttributeType.TEXT),
  displayOrder: z.number().int().min(0).default(0),
});

export type ProductAttributeFormData = z.infer<typeof productAttributeSchema>;

// Product Variation Schema
export const productVariationSchema = z.object({
  name: z
    .string()
    .min(1, 'Variation name is required')
    .max(200, 'Variation name must be less than 200 characters'),
  sku: z
    .string()
    .max(100, 'SKU must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  price: z
    .number()
    .positive('Price must be greater than 0')
    .optional(),
  stockQuantity: z
    .number()
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .default(0),
  weight: z
    .number()
    .positive('Weight must be greater than 0')
    .optional(),
  attributes: z
    .array(
      z.object({
        name: z.string().min(1, 'Attribute name is required'),
        value: z.string().min(1, 'Attribute value is required'),
      })
    )
    .min(1, 'At least one variation attribute is required'),
});

export type ProductVariationFormData = z.infer<typeof productVariationSchema>;

// Complete Product Schema (for validation before submission)
export const createProductSchema = z
  .object({
    ...productBasicInfoSchema.shape,
    ...productPricingSchema.shape,
    ...productShippingSchema.shape,
    ...productSeoSchema.shape,
    attributes: z.array(productAttributeSchema).optional(),
    variations: z.array(productVariationSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.compareAtPrice && data.price) {
        return data.compareAtPrice > data.price;
      }
      return true;
    },
    {
      message: 'Compare at price must be greater than regular price',
      path: ['compareAtPrice'],
    }
  )
  .refine(
    (data) => {
      if (data.requiresShipping && !data.weight) {
        return false;
      }
      return true;
    },
    {
      message: 'Weight is required for products requiring shipping',
      path: ['weight'],
    }
  );

export type CreateProductFormData = z.infer<typeof createProductSchema>;

// Update Product Schema - make all fields optional except name and price
export const updateProductSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Product name must be at least 2 characters')
      .max(200, 'Product name must be less than 200 characters'),
    price: z
      .number()
      .positive('Price must be greater than 0')
      .max(999999.99, 'Price is too high'),
    description: z
      .string()
      .max(5000, 'Description must be less than 5000 characters')
      .optional()
      .or(z.literal('')),
    shortDescription: z
      .string()
      .max(500, 'Short description must be less than 500 characters')
      .optional()
      .or(z.literal('')),
    categoryId: z.string().uuid('Invalid category').optional().or(z.literal('')),
    sku: z
      .string()
      .max(100, 'SKU must be less than 100 characters')
      .optional()
      .or(z.literal('')),
    barcode: z
      .string()
      .max(100, 'Barcode must be less than 100 characters')
      .optional()
      .or(z.literal('')),
    compareAtPrice: z
      .number()
      .positive('Compare at price must be greater than 0')
      .max(999999.99, 'Compare at price is too high')
      .optional(),
    costPrice: z
      .number()
      .positive('Cost price must be greater than 0')
      .max(999999.99, 'Cost price is too high')
      .optional(),
    stockQuantity: z
      .number()
      .int('Stock quantity must be a whole number')
      .min(0, 'Stock quantity cannot be negative')
      .optional(),
    lowStockThreshold: z
      .number()
      .int('Low stock threshold must be a whole number')
      .min(0, 'Low stock threshold cannot be negative')
      .optional(),
    trackInventory: z.boolean().optional(),
    allowBackorder: z.boolean().optional(),
    isDigital: z.boolean().optional(),
    requiresShipping: z.boolean().optional(),
    weight: z
      .number()
      .positive('Weight must be greater than 0')
      .max(9999.99, 'Weight is too high')
      .optional(),
    length: z
      .number()
      .positive('Length must be greater than 0')
      .max(9999.99, 'Length is too high')
      .optional(),
    width: z
      .number()
      .positive('Width must be greater than 0')
      .max(9999.99, 'Width is too high')
      .optional(),
    height: z
      .number()
      .positive('Height must be greater than 0')
      .max(9999.99, 'Height is too high')
      .optional(),
    metaTitle: z
      .string()
      .max(200, 'Meta title must be less than 200 characters')
      .optional()
      .or(z.literal('')),
    metaDescription: z
      .string()
      .max(500, 'Meta description must be less than 500 characters')
      .optional()
      .or(z.literal('')),
    metaKeywords: z
      .string()
      .max(500, 'Meta keywords must be less than 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.compareAtPrice && data.price) {
        return data.compareAtPrice > data.price;
      }
      return true;
    },
    {
      message: 'Compare at price must be greater than regular price',
      path: ['compareAtPrice'],
    }
  );

export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
