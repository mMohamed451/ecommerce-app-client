# Authentication Module Documentation

## Overview

The authentication module provides a complete user authentication system with login, registration, password reset, protected routes, and role-based access control.

## Features

### ✅ Completed

1. **User Authentication**
   - Login with email/password
   - User registration with validation
   - JWT token management (access + refresh tokens)
   - Automatic token refresh on expiration
   - Remember me functionality

2. **Password Management**
   - Forgot password flow
   - Reset password with token validation
   - Strong password validation rules

3. **Protected Routes**
   - Middleware-based route protection
   - Automatic redirect to login for unauthenticated users
   - Redirect to dashboard for authenticated users on auth pages

4. **Role-Based Access Control**
   - Three user roles: Admin, Vendor, Customer
   - Role-based UI rendering with `RoleGuard` component
   - Convenience components: `AdminOnly`, `VendorOnly`, `CustomerOnly`
   - `useRole()` hook for role checking

5. **User Interface**
   - Responsive auth pages
   - User dropdown with avatar
   - Role-specific dashboard
   - Toast notifications for feedback

## File Structure

```
frontend/
├── app/
│   ├── [locale]/
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   └── dashboard/page.tsx
│   └── providers.tsx
├── components/
│   ├── auth/
│   │   ├── user-dropdown.tsx
│   │   └── role-guard.tsx
│   └── ui/
│       ├── button.tsx
│       └── input.tsx
├── hooks/
│   ├── use-auth.ts
│   └── use-role.ts
├── lib/
│   ├── api/
│   │   └── auth.ts
│   ├── auth-storage.ts
│   ├── axios.ts
│   └── validations/
│       └── auth.ts
├── store/
│   └── auth-store.ts
├── types/
│   └── auth.ts
└── middleware.ts
```

## Usage Examples

### 1. Using the Auth Hook

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = () => {
    login({
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Role-Based Rendering

```typescript
import { AdminOnly, VendorOnly } from '@/components/auth/role-guard';

function MyPage() {
  return (
    <div>
      <AdminOnly fallback={<p>Admin content only</p>}>
        <AdminPanel />
      </AdminOnly>

      <VendorOnly>
        <VendorDashboard />
      </VendorOnly>
    </div>
  );
}
```

### 3. Using the Role Hook

```typescript
import { useRole } from '@/hooks/use-role';

function Navigation() {
  const { isAdmin, isVendor, hasAnyRole } = useRole();

  return (
    <nav>
      {isAdmin && <Link href="/admin">Admin Panel</Link>}
      {isVendor && <Link href="/vendor">Vendor Dashboard</Link>}
      {hasAnyRole([UserRole.ADMIN, UserRole.VENDOR]) && (
        <Link href="/analytics">Analytics</Link>
      )}
    </nav>
  );
}
```

### 4. Protected Pages

Pages in protected directories are automatically secured by middleware:

```typescript
// app/[locale]/dashboard/page.tsx
// This page is automatically protected
export default function DashboardPage() {
  const { user } = useAuth();
  return <div>Welcome, {user?.firstName}!</div>;
}
```

## API Endpoints Required

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Password Management
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Email Verification
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email

## Protected Routes

The following routes are automatically protected:

- `/dashboard/*` - User dashboard
- `/profile/*` - User profile
- `/orders/*` - Order management
- `/cart/*` - Shopping cart
- `/wishlist/*` - User wishlist
- `/vendor/*` - Vendor area (Vendor role required)
- `/admin/*` - Admin area (Admin role required)

## User Roles

### Customer
- Can browse products
- Can place orders
- Can manage profile and wishlist

### Vendor
- All Customer permissions
- Can create and manage products
- Can view vendor analytics
- Can manage orders for their products

### Admin
- All Vendor permissions
- Can manage users and vendors
- Can moderate content
- Can access system settings

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Email
- Valid email format
- Unique in the system

## State Management

Authentication state is managed using Zustand:

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initialize: () => void;
}
```

## Token Management

- **Access Token**: Stored in localStorage, automatically added to API requests
- **Refresh Token**: Stored in localStorage, used to refresh access token
- **Automatic Refresh**: Axios interceptor handles 401 errors and refreshes token
- **Secure Storage**: Tokens are cleared on logout

## Next Steps

To complete the authentication module, implement the backend endpoints listed above. The backend tasks are in Module 2: Authentication & Authorization - Backend section of the checklist.

## Testing Checklist

- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test registration with validation
- [ ] Test password reset flow
- [ ] Test protected route access
- [ ] Test role-based rendering
- [ ] Test token refresh mechanism
- [ ] Test logout functionality
- [ ] Test remember me functionality
- [ ] Test i18n on auth pages (EN/AR)
