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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName}! Manage your marketplace platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Store className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View and manage all users
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Vendors</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Approve and manage vendors
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Moderate Products</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Review and approve products
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor all orders
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Financial Reports</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View revenue and analytics
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-gray-500 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">System Settings</h3>
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
