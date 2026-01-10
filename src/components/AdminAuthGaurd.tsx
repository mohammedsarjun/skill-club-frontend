"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { setUser } from "@/store/slices/authSlice";
import { adminAuthApi } from "@/api/adminAuthApi";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = JSON.parse(localStorage.getItem("user")!);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const adminGuestRoutes = ["/admin/login"];

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        let currentUser = user;

        // No user → force login
        if (!currentUser) {
          if (!adminGuestRoutes.includes(pathname)) {
            router.replace("/admin/login");
            setAuthorized(false);
            return;
          }
          setAuthorized(true);
          return;
        }

        // ✅ user exists → check role
        if (currentUser.activeRole === "admin") {
          if (pathname === "/admin/login") {
            router.replace("/admin/categories-skills");
            setAuthorized(false);
            return;
          }
          setAuthorized(true);
          return;
        }

        // 🚫 not admin
        router.replace("/login");
        setAuthorized(false);
      } catch (err) {
        // error → send to login
        router.replace("/admin/login");
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [user, pathname, router, dispatch]);

  if (checking) return <p>Loading...</p>;
  if (!authorized) return null;

  return <>{children}</>;
}
