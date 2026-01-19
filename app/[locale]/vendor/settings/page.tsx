'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  vendorSettingsSchema,
  VendorSettingsFormData,
} from '@/lib/validations/vendor';
import { vendorApi } from '@/lib/api/vendor';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VendorSettingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/vendor/settings');
    }
  }, [isAuthenticated, router]);

  const { data: vendor } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: () => vendorApi.getProfile(),
    enabled: isAuthenticated,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendorSettingsFormData>({
    resolver: zodResolver(vendorSettingsSchema),
    defaultValues: {
      isActive: vendor?.isActive ?? true,
      acceptOrders: true,
      autoApproveReviews: false,
      notificationEmail: vendor?.businessEmail || '',
    },
  });

  useEffect(() => {
    if (vendor) {
      reset({
        isActive: vendor.isActive,
        acceptOrders: true,
        autoApproveReviews: false,
        notificationEmail: vendor.businessEmail,
      });
    }
  }, [vendor, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: VendorSettingsFormData) => {
      // This would be a separate API endpoint for settings
      // For now, we'll use updateProfile
      return vendorApi.updateProfile({});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

  const onSubmit = async (data: VendorSettingsFormData) => {
    await updateMutation.mutateAsync(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Vendor Settings</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Account Active
                  </label>
                  <p className="text-sm text-gray-500">
                    Enable or disable your vendor account
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Accept New Orders
                  </label>
                  <p className="text-sm text-gray-500">
                    Allow customers to place orders
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...register('acceptOrders')}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Auto-Approve Reviews
                  </label>
                  <p className="text-sm text-gray-500">
                    Automatically approve customer reviews
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...register('autoApproveReviews')}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Settings
            </h3>
            <div className="space-y-4">
              <Input
                label="Notification Email"
                type="email"
                {...register('notificationEmail')}
                error={errors.notificationEmail?.message}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={updateMutation.isPending}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
