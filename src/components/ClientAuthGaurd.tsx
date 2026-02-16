"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function ClientAuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.auth.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      if (!user) {
        // Not logged in → redirect to client login
        router.replace("/login");
        return;
      }

      // Logged in → check role
      if (user.activeRole !== "client") {
        router.replace("/freelancer/profile"); // redirect to freelancer or appropriate page
        return;
      }

      // User is client → allow access
      setChecking(false);
    };

    checkAccess();
  }, [user, pathname, router]);

  if (checking) return <p>Loading...</p>;

  return <>{children}</>;
}
