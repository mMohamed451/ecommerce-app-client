'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { NotificationPreference } from '@/types/profile';
import { NotificationPreferencesFormData } from '@/lib/validations/profile';
import { NotificationPreferencesForm } from '@/components/profile/notification-preferences-form';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: () => profileApi.getNotificationPreferences(),
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: NotificationPreferencesFormData) =>
      profileApi.updateNotificationPreferences(data),
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(['notificationPreferences'], updatedPreferences);
      setPreferences(updatedPreferences);
      toast.success('Notification preferences updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update preferences');
    },
  });

  useEffect(() => {
    if (data) {
      setPreferences(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !preferences) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {error instanceof Error
              ? error.message
              : 'Failed to load notification preferences'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Preferences
          </h1>
          <p className="mt-2 text-gray-600">
            Choose how you want to be notified about updates and activities
          </p>
        </div>

        <div className="mt-6">
          <NotificationPreferencesForm
            preferences={preferences}
            onSubmit={updatePreferencesMutation.mutateAsync}
            isLoading={updatePreferencesMutation.isPending}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
