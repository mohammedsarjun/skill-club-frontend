"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { setUser } from "@/store/slices/authSlice";
import { userApi } from "@/api/userApi";

export default function VerifyUser({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true); // verifying user
  const [authorized, setAuthorized] = useState(false); // only render children if true



  useEffect(() => {
    const verifyUser = async () => {
      try {
        let currentUser = user;

        if (!user) {
          const response = await userApi.me();
          console.log(response)
          if (response.success) {
            dispatch(setUser(response.data));
            currentUser = response.data;
          }
        }
      } catch {

      } finally {
        setChecking(false);
      }
    };

    verifyUser();
  }, []);

  if (checking) return <p>Loading...</p>;
//   if (!authorized) return null; // 🚫 block unauthorized content completely

  return <>{children}</>;
}
