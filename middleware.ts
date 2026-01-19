import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: 'en',
  localeDetection: true,
});

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/orders',
  '/cart',
  '/wishlist',
  '/vendor',
  '/admin',
];

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get locale from pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '');
  
  // Check if user has auth token in cookies
  // Note: Tokens are stored in localStorage, so middleware can't see them
  // This check only works if tokens are also stored in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Note: Tokens are stored in localStorage (client-side only)
  // Middleware can't access localStorage, so cookie check is limited
  // Client-side pages will handle auth checks for localStorage-based tokens
  
  // Redirect to login if accessing protected route without cookie auth
  // This handles direct page loads/refreshes
  // Client-side navigation after login will work because tokens are in localStorage
  if (isProtectedRoute && !isAuthenticated) {
    const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
    return NextResponse.redirect(
      new URL(`/${locale}/auth/login?redirect=${pathname}`, request.url)
    );
  }

  // Redirect to dashboard if trying to access auth routes while authenticated (cookie-based)
  if (isAuthRoute && isAuthenticated) {
    const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Apply i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
