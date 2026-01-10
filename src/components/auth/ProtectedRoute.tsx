// components/auth/ProtectedRoute.tsx
// Authentication guard - ensures user is logged in
"use client";

import { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/store';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional loading fallback
}

/**
 * ProtectedRoute component
 * 
 * Ensures user is authenticated before rendering children.
 * Redirects to /login if not authenticated.
 * 
 * Usage:
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/signup',
    '/otp',
    '/forgot-password',
    '/reset-password',
    '/admin/login',
    '/',
  ];

  useEffect(() => {
    // Skip check if still loading
    if (isLoading) return;

    // Allow public routes
    if (publicRoutes.includes(pathname) || pathname.startsWith('/reset-password')) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log('[ProtectedRoute] Not authenticated, redirecting to /login');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state while bootstrapping
  if (isLoading) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated && !publicRoutes.includes(pathname) && !pathname.startsWith('/reset-password')) {
    return null;
  }

  return <>{children}</>;
}
