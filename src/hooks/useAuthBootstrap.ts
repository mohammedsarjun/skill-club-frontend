// hooks/useAuthBootstrap.ts
// Bootstrap hook to fetch user data on app mount and hydrate Redux
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { axiosClient } from '@/api/axiosClient';
import {
  setUser,
  clearUser,
  setAuthLoading,
  setAuthError,
  User,
} from '@/store/slices/authSlice';

/**
 * Hook to bootstrap authentication state on app mount
 * 
 * Behavior:
 * - Calls /auth/me to fetch user data using HTTP-only cookie
 * - Hydrates Redux with user object if valid
 * - Clears auth and redirects to /login if token is missing/invalid/expired
 * - Only runs once on mount
 * 
 * Usage:
 * ```tsx
 * // In your root layout or App component
 * function RootLayout({ children }) {
 *   useAuthBootstrap();
 *   return <>{children}</>;
 * }
 * ```
 */
export function useAuthBootstrap() {
  const dispatch = useDispatch();
  const router = useRouter();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    // Prevent multiple bootstraps
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const bootstrap = async () => {
      try {
        dispatch(setAuthLoading(true));

        // Fetch user data from backend using HTTP-only cookie
        const response = await axiosClient.get('/auth/me');

        if (response.data?.success && response.data?.data) {
          const userData: User = response.data.data;

          // Validate required fields
          if (!userData.userId || !userData.roles || !Array.isArray(userData.roles)) {
            throw new Error('Invalid user data structure');
          }

          // Set default activeRole if missing
          if (!userData.activeRole && userData.roles.length > 0) {
            userData.activeRole = userData.roles[0] as 'freelancer' | 'client' | 'admin';
          }

          // Hydrate Redux with user data
          dispatch(setUser(userData));

          console.log('[Auth Bootstrap] User authenticated:', userData.userId);
        } else {
          throw new Error('Invalid response from /auth/me');
        }
      } catch (error: any) {
        console.warn('[Auth Bootstrap] Authentication failed:', error.message);

        // Clear Redux state
        dispatch(clearUser());
        dispatch(setAuthError(error.message || 'Authentication failed'));

        // Get current pathname
        const currentPath = window.location.pathname;

        // Public routes that don't require auth
        const publicRoutes = [
          '/login',
          '/signup',
          '/otp',
          '/forgot-password',
          '/reset-password',
          '/admin/login',
          '/',
        ];

        // Only redirect if not already on a public route
        if (!publicRoutes.includes(currentPath) && !currentPath.startsWith('/reset-password')) {
          console.log('[Auth Bootstrap] Redirecting to /login');
          router.replace('/login');
        }
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    bootstrap();
  }, [dispatch, router]);
}

/**
 * Hook to refresh user data (e.g., after profile updates)
 * 
 * Usage:
 * ```tsx
 * const refreshAuth = useAuthRefresh();
 * 
 * // After updating profile
 * await updateProfile(data);
 * await refreshAuth();
 * ```
 */
export function useAuthRefresh() {
  const dispatch = useDispatch();

  return async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      
      if (response.data?.success && response.data?.data) {
        dispatch(setUser(response.data.data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('[Auth Refresh] Failed:', error);
      return false;
    }
  };
}
