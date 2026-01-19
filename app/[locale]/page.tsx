import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store, Users, Shield, Zap, Globe } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Multi-Vendor
              <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Marketplace Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect buyers and sellers in a modern, secure, and scalable marketplace platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">Vendor Management</h3>
            <p className="text-gray-600">
              Complete vendor onboarding, verification, and management system
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">E-Commerce Ready</h3>
            <p className="text-gray-600">
              Full shopping cart, checkout, and order management capabilities
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Scalable</h3>
            <p className="text-gray-600">
              Enterprise-grade security with JWT authentication and role-based access
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Role Support</h3>
            <p className="text-gray-600">
              Admin, Vendor, and Customer roles with tailored dashboards
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Tech Stack</h3>
            <p className="text-gray-600">
              Built with Next.js 16, TypeScript, Tailwind CSS, and .NET 8
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">International Ready</h3>
            <p className="text-gray-600">
              Multi-language support with RTL/LTR layouts for global markets
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

