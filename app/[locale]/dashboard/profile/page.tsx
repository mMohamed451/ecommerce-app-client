'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { UserProfile } from '@/types/profile';
import { UpdateProfileFormData } from '@/lib/validations/profile';
import { EditProfileForm } from '@/components/profile/edit-profile-form';
import { AvatarUpload } from '@/components/profile/avatar-upload';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileFormData) => profileApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload avatar');
    },
  });

  useEffect(() => {
    if (data) {
      setProfile(data);
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

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {error instanceof Error ? error.message : 'Failed to load profile'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
          <AvatarUpload
            currentAvatar={profile.avatar}
            onUpload={uploadAvatarMutation.mutateAsync}
            isLoading={uploadAvatarMutation.isPending}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <EditProfileForm
            profile={profile}
            onSubmit={updateProfileMutation.mutateAsync}
            isLoading={updateProfileMutation.isPending}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
