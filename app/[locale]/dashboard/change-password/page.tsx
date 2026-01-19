'use client';

import { useMutation } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { ChangePasswordFormData } from '@/lib/validations/profile';
import { ChangePasswordForm } from '@/components/profile/change-password-form';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function ChangePasswordPage() {
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
          <p className="mt-2 text-gray-600">
            Update your password to keep your account secure
          </p>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <ChangePasswordForm
            onSubmit={changePasswordMutation.mutateAsync}
            isLoading={changePasswordMutation.isPending}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
