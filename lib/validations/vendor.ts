import { z } from 'zod';

// Step 1: Business Information
export const vendorBusinessInfoSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  businessDescription: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  businessEmail: z.string().email('Invalid email address'),
  businessPhone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      {
        message: 'Website must start with http:// or https://',
      }
    ),
});

// Step 2: Business Address
export const vendorAddressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().min(2, 'Country is required'),
});

// Step 3: Legal Information
export const vendorLegalInfoSchema = z.object({
  taxId: z
    .string()
    .min(5, 'Tax ID must be at least 5 characters')
    .optional()
    .or(z.literal('')),
  registrationNumber: z
    .string()
    .min(5, 'Registration number must be at least 5 characters')
    .optional()
    .or(z.literal('')),
});

// Complete vendor registration schema
export const vendorRegistrationSchema = vendorBusinessInfoSchema
  .merge(vendorAddressSchema)
  .merge(vendorLegalInfoSchema)
  .extend({
    documents: z
      .array(z.instanceof(File))
      .min(1, 'At least one document is required')
      .refine(
        (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
        {
          message: 'Each document must be less than 5MB',
        }
      )
      .refine(
        (files) =>
          files.every((file) =>
            ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
          ),
        {
          message: 'Documents must be PDF, JPEG, or PNG files',
        }
      ),
  });

// Vendor profile update schema
export const vendorProfileUpdateSchema = vendorBusinessInfoSchema
  .merge(vendorAddressSchema)
  .merge(vendorLegalInfoSchema);

// Vendor settings schema
export const vendorSettingsSchema = z.object({
  isActive: z.boolean(),
  acceptOrders: z.boolean(),
  autoApproveReviews: z.boolean(),
  notificationEmail: z.string().email().optional().or(z.literal('')),
});

export type VendorBusinessInfoFormData = z.infer<
  typeof vendorBusinessInfoSchema
>;
export type VendorAddressFormData = z.infer<typeof vendorAddressSchema>;
export type VendorLegalInfoFormData = z.infer<typeof vendorLegalInfoSchema>;
export type VendorRegistrationFormData = z.infer<
  typeof vendorRegistrationSchema
>;
export type VendorProfileUpdateFormData = z.infer<
  typeof vendorProfileUpdateSchema
>;
export type VendorSettingsFormData = z.infer<typeof vendorSettingsSchema>;
