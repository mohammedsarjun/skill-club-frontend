"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function FreelancerAuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.auth.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      if (!user) {
        // Not logged in → redirect to freelancer login
        router.replace("/login");
        return;
      }

      // Logged in → check role
      if (user.activeRole !== "freelancer") {
        router.replace("/client");
        return;
      }

      // User is freelancer → allow access
      setChecking(false);
    };

    checkAccess();
  }, [user, pathname, router]);

  if (checking) return <p>Loading...</p>;

  return <>{children}</>;
}
