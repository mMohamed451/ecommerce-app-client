'use client';

import { VendorRegistrationForm } from '@/components/vendor/vendor-registration-form';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VendorRegisterPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/vendor/register');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Become a Vendor</h1>
          <p className="mt-2 text-gray-600">
            Register your business to start selling on our marketplace
          </p>
        </div>
        <VendorRegistrationForm />
      </div>
    </DashboardLayout>
  );
}
