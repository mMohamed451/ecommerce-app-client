'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Package,
  Store,
  User,
  Settings,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, isVendor, isCustomer } = useRole();

  // Client-side auth check - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${currentPath}`);
    }
  }, [isAuthenticated, router]);

  // Show loading or nothing while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName} {user?.lastName}!
          </h1>
          <p className="mt-2 text-gray-600">
            You are logged in as: <span className="font-medium">{user?.role}</span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Admin Panel</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Manage users, vendors, and system settings
                  </p>
                </div>
              </div>
            </Link>
          )}

          {isVendor && (
            <>
              <Link
                href="/dashboard/products"
                className="bg-green-50 hover:bg-green-100 p-6 rounded-lg shadow transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">My Products</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Manage your product listings
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/vendor/orders"
                className="bg-green-50 hover:bg-green-100 p-6 rounded-lg shadow transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Orders</h3>
                    <p className="text-sm text-green-700 mt-1">
                      View and manage customer orders
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/vendor/dashboard"
                className="bg-green-50 hover:bg-green-100 p-6 rounded-lg shadow transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Vendor Dashboard</h3>
                    <p className="text-sm text-green-700 mt-1">
                      View analytics and insights
                    </p>
                  </div>
                </div>
              </Link>
            </>
          )}

          {isCustomer && (
            <>
              <Link
                href="/dashboard/orders"
                className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg shadow transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">My Orders</h3>
                    <p className="text-sm text-purple-700 mt-1">
                      Track your purchases
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/dashboard/wishlist"
                className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg shadow transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Wishlist</h3>
                    <p className="text-sm text-purple-700 mt-1">
                      View saved items
                    </p>
                  </div>
                </div>
              </Link>
            </>
          )}

          <Link
            href="/dashboard/profile"
            className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg shadow transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-500 p-3 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-700 mt-1">
                  Manage your personal information
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
