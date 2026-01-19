'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';

export function UserDropdown() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const getInitials = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const getDashboardLink = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.VENDOR:
        return '/vendor/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            getInitials()
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200 animate-slide-up backdrop-blur-lg">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
            <p className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-600 truncate mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full">
              {user.role}
            </span>
          </div>

          <div className="py-1">
            <Link
              href={getDashboardLink()}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/profile"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>

            <Link
              href="/dashboard/orders"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Orders
            </Link>

            {user.role === UserRole.VENDOR && (
              <>
                <Link
                  href="/vendor/products"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Products
                </Link>
                <Link
                  href="/vendor/analytics"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </Link>
              </>
            )}

            {user.role === UserRole.ADMIN && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Users
                </Link>
                <Link
                  href="/admin/vendors"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Vendors
                </Link>
              </>
            )}
          </div>

          <hr className="my-1 border-gray-200" />

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
