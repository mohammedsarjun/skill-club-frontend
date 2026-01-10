"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { setUser } from "@/store/slices/authSlice";
import { userApi } from "@/api/userApi";
import toast from "react-hot-toast";

export default function FreelancerAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const guestRoutes = [
    "/login",
    "/signup",
    "/admin/login",
    "/otp",
    "/forgot-password",
    "/reset-password",
    "/",
  ];
  const onboardingPaths = [
    "/onboarding/role",
    "/onboarding/client",
    "/onboarding/freelancer",
  ];


  const user = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")!):null;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyFreelancer = async () => {
      try {
        let currentUser = user;
        // No user → force login
        if (!currentUser) {
          router.replace("/login");
          return;
        }

        if (!currentUser.roles.includes("freelancer")) {
          router.replace("/onboarding/freelancer/0");
          return;
        }

        if (currentUser.activeRole == "client") {
          router.replace("/client");
          return;
        }

        if (currentUser.activeRole == "admin") {
          router.replace("/admin/jobs");
          return;
        }

        if (currentUser.isFreelancerBlocked) {
          router.replace("/freelancer/blocked");
          return;
        }
      } catch (err) {
        // error → send to login
        router.replace("/login");
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyFreelancer();
  }, [user, pathname, router, dispatch]);

  return <>{children}</>;

  if (checking) return <p>Loading...</p>;
  if (!authorized) return null; // 🚫 block unauthorized content completely

  return <>{children}</>;
}
