import axiosInstance from '../axios';
import {
  Vendor,
  VendorRegistrationRequest,
  VendorProfileUpdate,
  VendorAnalytics,
  VendorRating,
  VendorReviewSummary,
} from '@/types/vendor';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export const vendorApi = {
  // Register as vendor
  register: async (data: VendorRegistrationRequest): Promise<Vendor> => {
    const formData = new FormData();
    
    // Add business information
    formData.append('businessName', data.businessName);
    formData.append('businessEmail', data.businessEmail);
    formData.append('businessPhone', data.businessPhone);
    if (data.businessDescription) {
      formData.append('businessDescription', data.businessDescription);
    }
    if (data.website) {
      formData.append('website', data.website);
    }
    
    // Add address
    formData.append('street', data.street);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('zipCode', data.zipCode);
    formData.append('country', data.country);
    
    // Add legal information
    if (data.taxId) {
      formData.append('taxId', data.taxId);
    }
    if (data.registrationNumber) {
      formData.append('registrationNumber', data.registrationNumber);
    }
    
    // Add documents
    data.documents.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
    
    const response = await axiosInstance.post('/vendor/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Vendor registration failed');
  },

  // Get vendor profile
  getProfile: async (): Promise<Vendor> => {
    const response = await axiosInstance.get('/vendor/profile');
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get vendor profile');
  },

  // Update vendor profile
  updateProfile: async (data: VendorProfileUpdate): Promise<Vendor> => {
    const response = await axiosInstance.put('/vendor/profile', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update vendor profile');
  },

  // Upload logo
  uploadLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await axiosInstance.post('/vendor/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data.logoUrl;
    }
    throw new Error(result.message || 'Failed to upload logo');
  },

  // Upload cover image
  uploadCoverImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    const response = await axiosInstance.post('/vendor/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data.coverImageUrl;
    }
    throw new Error(result.message || 'Failed to upload cover image');
  },

  // Get vendor analytics
  getAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<VendorAnalytics> => {
    const response = await axiosInstance.get('/vendor/analytics', { params });
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get vendor analytics');
  },

  // Get vendor ratings/reviews
  getRatings: async (
    params?: PaginationParams & { rating?: number }
  ): Promise<PaginatedResponse<VendorRating>> => {
    const response = await axiosInstance.get('/vendor/ratings', { params });
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get vendor ratings');
  },

  // Get vendor review summary
  getReviewSummary: async (): Promise<VendorReviewSummary> => {
    const response = await axiosInstance.get('/vendor/ratings/summary');
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get review summary');
  },

  // Upload verification documents
  uploadDocuments: async (files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
    
    await axiosInstance.post('/vendor/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get verification status
  getVerificationStatus: async (): Promise<{
    status: string;
    documents: any[];
  }> => {
    const response = await axiosInstance.get('/vendor/verification');
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get verification status');
  },
};
