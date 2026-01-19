'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  notificationPreferencesSchema,
  NotificationPreferencesFormData,
} from '@/lib/validations/profile';
import { Button } from '@/components/ui/button';
import { NotificationPreference } from '@/types/profile';
import { useEffect } from 'react';

interface NotificationPreferencesFormProps {
  preferences: NotificationPreference;
  onSubmit: (data: NotificationPreferencesFormData) => Promise<void>;
  isLoading?: boolean;
}

export function NotificationPreferencesForm({
  preferences,
  onSubmit,
  isLoading = false,
}: NotificationPreferencesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NotificationPreferencesFormData>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      emailNotifications: preferences.emailNotifications,
      smsNotifications: preferences.smsNotifications,
      pushNotifications: preferences.pushNotifications,
      orderUpdates: preferences.orderUpdates,
      promotionalEmails: preferences.promotionalEmails,
      securityAlerts: preferences.securityAlerts,
      marketingEmails: preferences.marketingEmails,
    },
  });

  useEffect(() => {
    reset({
      emailNotifications: preferences.emailNotifications,
      smsNotifications: preferences.smsNotifications,
      pushNotifications: preferences.pushNotifications,
      orderUpdates: preferences.orderUpdates,
      promotionalEmails: preferences.promotionalEmails,
      securityAlerts: preferences.securityAlerts,
      marketingEmails: preferences.marketingEmails,
    });
  }, [preferences, reset]);

  const onFormSubmit = async (data: NotificationPreferencesFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                {...register('emailNotifications')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Order Updates
                </label>
                <p className="text-xs text-gray-500">
                  Get notified about order status changes
                </p>
              </div>
              <input
                type="checkbox"
                {...register('orderUpdates')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Security Alerts
                </label>
                <p className="text-xs text-gray-500">
                  Important security notifications
                </p>
              </div>
              <input
                type="checkbox"
                {...register('securityAlerts')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Marketing & Promotions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Promotional Emails
                </label>
                <p className="text-xs text-gray-500">
                  Receive special offers and promotions
                </p>
              </div>
              <input
                type="checkbox"
                {...register('promotionalEmails')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Marketing Emails
                </label>
                <p className="text-xs text-gray-500">
                  Product updates and news
                </p>
              </div>
              <input
                type="checkbox"
                {...register('marketingEmails')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Other Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  SMS Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Receive notifications via SMS
                </p>
              </div>
              <input
                type="checkbox"
                {...register('smsNotifications')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Push Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Receive browser push notifications
                </p>
              </div>
              <input
                type="checkbox"
                {...register('pushNotifications')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" isLoading={isLoading} size="lg">
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
