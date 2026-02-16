import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GUEST_ONLY_PREFIXES = ["/login", "/signup", "/otp", "/forgot-password"];
const PUBLIC_PATHS = ["/"];
const ADMIN_GUEST_PATHS = ["/admin/login"];

interface SessionData {
  activeRole: string;
  roles: string[];
  isFreelancerOnboarded: boolean;
  isClientOnboarded: boolean;
}

function parseSessionCookie(request: NextRequest): SessionData | null {
  const raw = request.cookies.get("session_info")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as SessionData;
  } catch {
    return null;
  }
}

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

function matchesExact(pathname: string, paths: string[]): boolean {
  return paths.includes(pathname);
}

function getSessionRedirectPath(session: SessionData): string {
  if (!session.roles || session.roles.length === 0) {
    return "/onboarding/role";
  }

  if (session.activeRole === "admin") {
    return "/admin";
  }

  if (session.activeRole === "client") {
    if (!session.isClientOnboarded) return "/onboarding/client";
    return "/client";
  }

  if (session.activeRole === "freelancer") {
    if (!session.isFreelancerOnboarded) return "/onboarding/freelancer/0";
    return "/freelancer/profile";
  }

  return "/client";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const session = parseSessionCookie(request);
  const isAuthenticated = !!accessToken;

  if (matchesExact(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/reset-password")) {
    return NextResponse.next();
  }

  if (matchesExact(pathname, ADMIN_GUEST_PATHS)) {
    if (isAuthenticated && session?.activeRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (matchesPrefix(pathname, GUEST_ONLY_PREFIXES)) {
    if (isAuthenticated && session) {
      const redirectPath = getSessionRedirectPath(session);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !matchesExact(pathname, ADMIN_GUEST_PATHS)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (session && session.activeRole !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/client") ||
    pathname.startsWith("/freelancer") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/account")
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|images|public|api).*)",
  ],
};
