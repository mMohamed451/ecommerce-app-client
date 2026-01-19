'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { VendorProfileForm } from '@/components/vendor/vendor-profile-form';
import { VerificationStatus } from '@/components/vendor/verification-status';
import { vendorApi } from '@/lib/api/vendor';
import { Vendor } from '@/types/vendor';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useRef } from 'react';

export default function VendorProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/vendor/profile');
    }
  }, [isAuthenticated, router]);

  const { data: vendor, isLoading } = useQuery<Vendor>({
    queryKey: ['vendor-profile'],
    queryFn: () => vendorApi.getProfile(),
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: vendorApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: vendorApi.uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      toast.success('Logo uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload logo');
    },
  });

  const uploadCoverMutation = useMutation({
    mutationFn: vendorApi.uploadCoverImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      toast.success('Cover image uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload cover image');
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadLogoMutation.mutate(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCoverMutation.mutate(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!vendor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">No vendor profile found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Vendor Profile
        </h1>

        {/* Cover Image */}
        <div className="relative mb-6 h-64 bg-gray-200 rounded-lg overflow-hidden">
          {vendor.coverImage ? (
            <img
              src={vendor.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-2"
            disabled={uploadCoverMutation.isPending}
          >
            <Upload className="w-4 h-4" />
            {uploadCoverMutation.isPending ? 'Uploading...' : 'Upload Cover'}
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt="Logo"
                className="w-24 h-24 rounded-lg object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700"
              disabled={uploadLogoMutation.isPending}
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {vendor.businessName}
            </h2>
            <p className="text-gray-600">{vendor.businessEmail}</p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mb-6">
          <VerificationStatus
            status={vendor.verificationStatus}
            documents={vendor.verificationDocuments}
          />
        </div>

        {/* Profile Form */}
        <VendorProfileForm
          vendor={vendor}
          onSubmit={updateMutation.mutateAsync}
          isLoading={updateMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
