import { User } from "@/store/slices/authSlice";

export function getAuthRedirectPath(user: User): string {
  if (!user.roles || user.roles.length === 0) {
    return "/onboarding/role";
  }

  if (user.activeRole === "admin") {
    return "/admin";
  }

  if (user.activeRole === "client") {
    if (user.isClientBlocked) return "/client/blocked";
    if (!user.isClientOnboarded) return "/onboarding/client";
    return "/client";
  }

  if (user.activeRole === "freelancer") {
    if (user.isFreelancerBlocked) return "/freelancer/blocked";
    if (!user.isFreelancerOnboarded) return "/onboarding/freelancer/0";
    return "/freelancer/profile";
  }

  return "/login";
}
