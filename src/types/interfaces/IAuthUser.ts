export type UserRole = "freelancer" | "client" | "admin";

export interface IAuthUser {
  userId: string;
  roles: UserRole[];
  activeRole: UserRole;
  isOnboardingCompleted: boolean;
  isFreelancerOnboarded: boolean;
  isClientOnboarded: boolean;
  isFreelancerBlocked: boolean;
  isClientBlocked: boolean;
}

export interface ISessionData {
  activeRole: UserRole;
  roles: UserRole[];
  isFreelancerOnboarded: boolean;
  isClientOnboarded: boolean;
}
