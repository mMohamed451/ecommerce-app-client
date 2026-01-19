'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { VendorAnalyticsDisplay } from '@/components/vendor/vendor-analytics';
import { VerificationStatus } from '@/components/vendor/verification-status';
import { vendorApi } from '@/lib/api/vendor';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/vendor/dashboard');
    }
  }, [isAuthenticated, router]);

  const { data: vendor } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: () => vendorApi.getProfile(),
    enabled: isAuthenticated,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['vendor-analytics'],
    queryFn: () => vendorApi.getAnalytics(),
    enabled: isAuthenticated,
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of your business performance
          </p>
        </div>

        {/* Verification Status Alert */}
        {vendor && vendor.verificationStatus !== 'Approved' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">
                Verification Required
              </h3>
              <p className="text-sm text-yellow-700">
                Your vendor account is pending verification. Complete your
                profile and upload required documents to start selling.
              </p>
            </div>
            <Link
              href="/vendor/profile"
              className="text-sm font-medium text-yellow-700 hover:text-yellow-900"
            >
              Complete Profile →
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link
            href="/vendor/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">Add or edit products</p>
              </div>
            </div>
          </Link>
          <Link
            href="/vendor/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600">Manage customer orders</p>
              </div>
            </div>
          </Link>
          <Link
            href="/vendor/analytics"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed reports</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Analytics */}
        {analyticsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : analytics ? (
          <VendorAnalyticsDisplay analytics={analytics} />
        ) : null}
      </div>
    </DashboardLayout>
  );
}
