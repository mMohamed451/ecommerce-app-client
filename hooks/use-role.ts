import { useAuth } from './use-auth';
import { UserRole } from '@/types/auth';

export function useRole() {
  const { user } = useAuth();

  const isAdmin = user?.role === UserRole.ADMIN;
  const isVendor = user?.role === UserRole.VENDOR;
  const isCustomer = user?.role === UserRole.CUSTOMER;

  const hasRole = (role: UserRole) => user?.role === role;
  const hasAnyRole = (roles: UserRole[]) =>
    user ? roles.includes(user.role as UserRole) : false;

  return {
    role: user?.role,
    isAdmin,
    isVendor,
    isCustomer,
    hasRole,
    hasAnyRole,
  };
}
