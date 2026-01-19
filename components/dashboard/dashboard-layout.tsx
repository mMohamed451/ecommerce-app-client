'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserDropdown } from '@/components/auth/user-dropdown';
import {
  LayoutDashboard,
  User,
  Lock,
  MapPin,
  Bell,
  Menu,
  X,
  ShoppingBag,
  Heart,
  Package,
  Store,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    label: 'Change Password',
    href: '/dashboard/change-password',
    icon: Lock,
  },
  {
    label: 'Addresses',
    href: '/dashboard/addresses',
    icon: MapPin,
  },
  {
    label: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
  },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingBag,
    roles: ['Customer'],
  },
  {
    label: 'Wishlist',
    href: '/dashboard/wishlist',
    icon: Heart,
    roles: ['Customer'],
  },
  {
    label: 'My Products',
    href: '/dashboard/products',
    icon: Package,
    roles: ['Vendor'],
  },
  {
    label: 'Vendor Dashboard',
    href: '/vendor/dashboard',
    icon: Store,
    roles: ['Vendor'],
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-white/95 backdrop-blur-lg border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
            <h2 className="text-xl font-bold text-white">Marketplace</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary-700'
                      )}
                    >
                      <Icon className={cn(
                        'h-5 w-5 transition-transform duration-200',
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'
                      )} />
                      <span className={cn(
                        'font-medium',
                        isActive ? 'text-white' : 'text-gray-700 group-hover:text-primary-700'
                      )}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex-1 lg:flex-none" />
              <UserDropdown />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
