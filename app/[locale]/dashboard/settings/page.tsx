'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { profileApi } from '@/lib/api/profile';
import { z } from 'zod';

const settingsSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  language: z.enum(['en', 'ar']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    
    if (!isAuthenticated && typeof window !== 'undefined') {
      hasRedirected.current = true;
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, router]);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => profileApi.getProfile(),
    enabled: isAuthenticated,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      email: user?.email || '',
      phone: profile?.phone || '',
      language: 'en',
      theme: 'system',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        email: user?.email || '',
        phone: profile.phone || '',
        language: 'en',
        theme: 'system',
      });
    }
  }, [profile, user, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      // Update profile with phone if provided
      if (data.phone !== undefined && data.phone !== profile?.phone) {
        await profileApi.updateProfile({
          phone: data.phone || '',
        });
      }
      // Note: Email cannot be changed via API
      // Language and theme stored in localStorage
      if (data.language) {
        localStorage.setItem('language', data.language);
        // Reload page to apply language change
        window.location.reload();
      }
      if (data.theme) {
        localStorage.setItem('theme', data.theme);
        // Apply theme immediately
        if (data.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (data.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    await updateMutation.mutateAsync(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  {...register('email')}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  {...register('language')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية (Arabic)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  {...register('theme')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Privacy & Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Two-Factor Authentication
                  </label>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info('Two-factor authentication coming soon')}
                >
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Change Password
                  </label>
                  <p className="text-sm text-gray-500">
                    Update your account password
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/change-password')}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
