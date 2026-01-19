import axiosInstance from '../axios';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsParams,
  ProductsListResponse,
  UploadProductImageRequest,
  UpdateInventoryRequest,
  InventoryResponse,
  Category,
} from '@/types/product';
import { ApiResponse } from '@/types';

export const productApi = {
  // Get single product by ID
  getProduct: async (productId: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${productId}`);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get product');
  },

  // Get single product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/slug/${slug}`);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get product');
  },

  // Get products list
  getProducts: async (params?: GetProductsParams): Promise<ProductsListResponse> => {
    const response = await axiosInstance.get('/products', { params });
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get products');
  },

  // Create product
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await axiosInstance.post('/products', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create product');
  },

  // Update product
  updateProduct: async (
    productId: string,
    data: UpdateProductRequest
  ): Promise<Product> => {
    const response = await axiosInstance.put(`/products/${productId}`, data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update product');
  },

  // Delete product
  deleteProduct: async (productId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/products/${productId}`);
    const result = response.data;
    if (!result.isSuccess) {
      throw new Error(result.message || 'Failed to delete product');
    }
  },

  // Upload product image
  uploadProductImage: async (
    data: UploadProductImageRequest
  ): Promise<{ id: string; fileUrl: string; isPrimary: boolean }> => {
    const formData = new FormData();
    formData.append('fileStream', data.file);
    formData.append('fileName', data.file.name);
    formData.append('contentType', data.file.type);
    formData.append('fileSize', data.file.size.toString());
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', data.displayOrder.toString());
    }
    if (data.isPrimary !== undefined) {
      formData.append('isPrimary', data.isPrimary.toString());
    }
    if (data.altText) {
      formData.append('altText', data.altText);
    }

    const response = await axiosInstance.post(
      `/products/${data.productId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to upload image');
  },

  // Update inventory
  updateInventory: async (
    data: UpdateInventoryRequest
  ): Promise<InventoryResponse> => {
    const response = await axiosInstance.put(
      `/products/${data.productId}/inventory`,
      {
        stockQuantity: data.stockQuantity,
        lowStockThreshold: data.lowStockThreshold,
        trackInventory: data.trackInventory,
        allowBackorder: data.allowBackorder,
      }
    );
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update inventory');
  },

  // Get categories
  getCategories: async (params?: {
    parentId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    includeChildren?: boolean;
  }): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories', { params });
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get categories');
  },

  // Create category
  createCategory: async (data: {
    parentId?: string;
    name: string;
    description?: string;
    imageUrl?: string;
    icon?: string;
    displayOrder?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }): Promise<Category> => {
    const response = await axiosInstance.post('/categories', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create category');
  },

  // Update category
  updateCategory: async (
    categoryId: string,
    data: {
      parentId?: string;
      name: string;
      description?: string;
      imageUrl?: string;
      icon?: string;
      displayOrder?: number;
      isActive?: boolean;
      isFeatured?: boolean;
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string;
    }
  ): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${categoryId}`, data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update category');
  },

  // Delete category
  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    const result = response.data;
    if (!result.isSuccess) {
      throw new Error(result.message || 'Failed to delete category');
    }
  },

  // Export products
  exportProducts: async (params?: {
    categoryId?: string;
    status?: string;
    isActive?: boolean;
  }): Promise<Blob> => {
    const response = await axiosInstance.get('/products/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Import products
  importProducts: async (
    file: File,
    skipErrors: boolean = false
  ): Promise<{
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('fileStream', file);
    formData.append('fileName', file.name);
    formData.append('skipErrors', skipErrors.toString());

    const response = await axiosInstance.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to import products');
  },
};
