// App constants

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'Marketplace';
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5223/api';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Storage
export const STORAGE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:9000';

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Currency
export const DEFAULT_CURRENCY = 'USD';
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP'];

// Language
export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'ar'];

// Routes
export const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/products',
  '/vendors',
];

export const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/orders',
  '/cart',
  '/wishlist',
];

export const VENDOR_ROUTES = [
  '/vendor/dashboard',
  '/vendor/products',
  '/vendor/orders',
  '/vendor/analytics',
];

export const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/vendors',
  '/admin/products',
  '/admin/orders',
];
