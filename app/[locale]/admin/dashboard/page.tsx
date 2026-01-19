'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Settings,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = useRole();
  const hasRedirected = useRef(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (hasRedirected.current) return;
    
    if (typeof window === 'undefined') return;

    if (!isAuthenticated) {
      hasRedirected.current = true;
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (isAuthenticated && !isAdmin) {
      hasRedirected.current = true;
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Show loading while checking auth or redirecting
  if (!isAuthenticated || (isAuthenticated && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome back, <span className="font-semibold text-primary-600">{user?.firstName}</span>! Manage your marketplace platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Vendors</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                <Store className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Manage Users</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View and manage all users
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Manage Vendors</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Approve and manage vendors
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Moderate Products</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Review and approve products
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">View Orders</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor all orders
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Financial Reports</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View revenue and analytics
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-4 rounded-xl shadow-lg shadow-gray-500/30 group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">System Settings</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure platform settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
