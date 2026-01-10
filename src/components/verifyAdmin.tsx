"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { setUser } from "@/store/slices/authSlice";
import { adminAuthApi } from "@/api/adminAuthApi";

export default function VerifyAuthAdmin({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        let currentUser = user;

        // fetch user if not already in redux
        if (!user) {
          const response = await adminAuthApi.me();

          if (response.success) {
            dispatch(setUser(response.data));
            currentUser = response.data;
          }
        }
      } catch (err) {

      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  if (checking) return <p>Loading...</p>;
  // if (!authorized) return null;

  return <>{children}</>;
}
