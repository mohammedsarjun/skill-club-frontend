// components/auth/RoleRoute.tsx
// Role-based route guard with onboarding checks
"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "@/store";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'freelancer' | 'client' | 'admin'>;
  requireOnboarding?: boolean; // Default true
}

/**
 * RoleRoute Component
 * 
 * Ensures user has correct role and onboarding status for the route.
 * 
 * Features:
 * - Checks if user's activeRole matches allowedRoles
 * - Optionally checks onboarding status based on role
 * - Redirects to onboarding page if not completed
 * - Redirects to appropriate dashboard if wrong role
 * - Prevents unauthorized access to role-specific routes
 * 
 * @example
 * // Freelancer route with onboarding check
 * <RoleRoute allowedRoles={['freelancer']} requireOnboarding={true}>
 *   <FreelancerDashboard />
 * </RoleRoute>
 * 
 * @example
 * // Admin route without onboarding check
 * <RoleRoute allowedRoles={['admin']} requireOnboarding={false}>
 *   <AdminPanel />
 * </RoleRoute>
 */
export default function RoleRoute({
  children,
  allowedRoles,
  requireOnboarding = true,
}: RoleRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Wait for auth bootstrap to complete
    if (isLoading) return;

    // Should already be authenticated (ProtectedRoute handles this)
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Check if user has an active role
    if (!user.activeRole) {
      // User has no active role - redirect to role selection
      router.replace("/select-role");
      return;
    }

    // Check if active role is allowed for this route
    if (!allowedRoles.includes(user.activeRole)) {
      // Redirect to correct dashboard based on their active role
      const dashboardMap: Record<string, string> = {
        freelancer: "/freelancer/dashboard",
        client: "/client/dashboard",
        admin: "/admin/dashboard",
      };
      
      router.replace(dashboardMap[user.activeRole] || "/");
      return;
    }

    // If onboarding is required, check completion status
    if (requireOnboarding) {
      const isOnboarded = getOnboardingStatus(user, user.activeRole);
      
      if (!isOnboarded) {
        // Prevent redirect loop - don't redirect if already on onboarding page
        const onboardingPaths = [
          "/onboarding/freelancer",
          "/onboarding/client",
        ];
        
        if (!onboardingPaths.some(path => pathname.startsWith(path))) {
          const onboardingMap: Record<string, string> = {
            freelancer: "/onboarding/freelancer",
            client: "/onboarding/client",
          };
          
          const onboardingPath = onboardingMap[user.activeRole];
          if (onboardingPath) {
            router.replace(onboardingPath);
            return;
          }
        }
      }
    }

    // Check block status
    if (user.activeRole === 'freelancer' && user.isFreelancerBlocked) {
      router.replace("/blocked/freelancer");
      return;
    }
    
    if (user.activeRole === 'client' && user.isClientBlocked) {
      router.replace("/blocked/client");
      return;
    }

  }, [isLoading, isAuthenticated, user, allowedRoles, requireOnboarding, router, pathname]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If all checks pass, render children
  if (
    isAuthenticated &&
    user &&
    user.activeRole &&
    allowedRoles.includes(user.activeRole)
  ) {
    // If onboarding required, check status
    if (requireOnboarding) {
      const isOnboarded = getOnboardingStatus(user, user.activeRole);
      if (!isOnboarded) {
        // Already handling redirect in useEffect
        return null;
      }
    }

    return <>{children}</>;
  }

  // Fallback - show nothing while redirecting
  return null;
}

/**
 * Helper function to get onboarding status based on role
 */
function getOnboardingStatus(
  user: RootState['auth']['user'],
  role: 'freelancer' | 'client' | 'admin'
): boolean {
  if (!user) return false;
  
  switch (role) {
    case 'freelancer':
      return user.isFreelancerOnboarded ?? false;
    case 'client':
      return user.isClientOnboarded ?? false;
    case 'admin':
      // Admins don't need onboarding
      return true;
    default:
      return false;
  }
}
