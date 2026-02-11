import { ISessionData, UserRole } from "@/types/interfaces/IAuthUser";

const SESSION_COOKIE_NAME = "session_info";

export function setSessionCookie(data: ISessionData): void {
  const encoded = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${SESSION_COOKIE_NAME}=${encoded}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function buildSessionData(user: {
  activeRole: UserRole;
  roles: UserRole[];
  isFreelancerOnboarded: boolean;
  isClientOnboarded: boolean;
}): ISessionData {
  return {
    activeRole: user.activeRole,
    roles: user.roles,
    isFreelancerOnboarded: user.isFreelancerOnboarded,
    isClientOnboarded: user.isClientOnboarded,
  };
}
