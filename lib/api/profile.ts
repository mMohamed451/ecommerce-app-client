import axiosInstance from '../axios';
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserProfile,
  Address,
  NotificationPreference,
} from '@/types/profile';
import { ApiResponse } from '@/types';

export const profileApi = {
  // Get User Profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get('/profile');
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get profile');
  },

  // Update Profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await axiosInstance.put('/profile', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update profile');
  },

  // Change Password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    const response = await axiosInstance.post('/profile/change-password', data);
    const result = response.data;
    if (!result.isSuccess) {
      throw new Error(result.message || 'Failed to change password');
    }
  },

  // Upload Avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to upload avatar');
  },

  // Get Addresses
  getAddresses: async (): Promise<Address[]> => {
    const response = await axiosInstance.get('/profile/addresses');
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get addresses');
  },

  // Add Address
  addAddress: async (data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
    const response = await axiosInstance.post('/profile/addresses', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to add address');
  },

  // Update Address
  updateAddress: async (
    id: string,
    data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Address> => {
    const response = await axiosInstance.put(`/profile/addresses/${id}`, data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update address');
  },

  // Delete Address
  deleteAddress: async (id: string): Promise<void> => {
    const response = await axiosInstance.delete(`/profile/addresses/${id}`);
    const result = response.data;
    if (!result.isSuccess) {
      throw new Error(result.message || 'Failed to delete address');
    }
  },

  // Set Default Address
  setDefaultAddress: async (id: string): Promise<void> => {
    const response = await axiosInstance.post(`/profile/addresses/${id}/set-default`);
    const result = response.data;
    if (!result.isSuccess) {
      throw new Error(result.message || 'Failed to set default address');
    }
  },

  // Get Notification Preferences
  getNotificationPreferences: async (): Promise<NotificationPreference> => {
    const response = await axiosInstance.get('/profile/notifications');
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get notification preferences');
  },

  // Update Notification Preferences
  updateNotificationPreferences: async (
    data: Omit<NotificationPreference, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<NotificationPreference> => {
    const response = await axiosInstance.put('/profile/notifications', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update notification preferences');
  },
};
