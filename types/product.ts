// Product-related types

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  categoryId?: string;
  categoryName?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  status: ProductStatus;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  rating: number;
  reviewCount: number;
  viewCount: number;
  salesCount: number;
  approvalStatus: ProductApprovalStatus;
  publishedAt?: string;
  images: ProductImage[];
  variations: ProductVariation[];
  attributes: ProductAttribute[];
  createdAt: string;
  updatedAt?: string;
}

export enum ProductStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
}

export enum ProductApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  UNDER_REVIEW = 'UnderReview',
}

export interface ProductImage {
  id: string;
  fileUrl: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariation {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  attributes: ProductVariationAttribute[];
}

export interface ProductVariationAttribute {
  name: string;
  value: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  type: AttributeType;
  displayOrder: number;
}

export enum AttributeType {
  TEXT = 'Text',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  DATE = 'Date',
  COLOR = 'Color',
  IMAGE = 'Image',
}

export interface Category {
  id: string;
  parentId?: string;
  parentName?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  path?: string;
  level: number;
  productCount: number;
  children?: Category[];
  createdAt: string;
  updatedAt?: string;
}

// Request types
export interface CreateProductRequest {
  categoryId?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  attributes?: ProductAttributeInput[];
  variations?: ProductVariationInput[];
}

export interface ProductAttributeInput {
  name: string;
  value: string;
  type: AttributeType;
  displayOrder: number;
}

export interface ProductVariationInput {
  name: string;
  sku?: string;
  price?: number;
  stockQuantity: number;
  weight?: number;
  attributes: ProductVariationAttributeInput[];
}

export interface ProductVariationAttributeInput {
  name: string;
  value: string;
}

export interface UpdateProductRequest {
  categoryId?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface GetProductsParams {
  vendorId?: string;
  categoryId?: string;
  searchTerm?: string;
  status?: ProductStatus;
  isActive?: boolean;
  isFeatured?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'name' | 'price' | 'created' | 'rating';
  sortDescending?: boolean;
}

export interface ProductsListResponse {
  products: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface UploadProductImageRequest {
  productId: string;
  file: File;
  displayOrder?: number;
  isPrimary?: boolean;
  altText?: string;
}

export interface UpdateInventoryRequest {
  productId: string;
  stockQuantity?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  allowBackorder?: boolean;
}

export interface InventoryResponse {
  productId: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
}
