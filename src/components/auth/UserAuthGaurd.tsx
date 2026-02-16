"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/authApi";

export default function UserAuthGaurd({ children }: {
  children: ReactNode;
}) {
  const router = useRouter();
  const isLogged=true

  useEffect(() => {
    async function verify() {
     const user = await authApi.me()

      if (user) {
        router.replace("/client");
      }
    }

    verify();
  }, []);

  return <>{children}</>;
}
