"use client";

import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/authApi";
export default function GoogleLogin() {
  const dispatch = useDispatch();
  const route = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).google) {
        clearInterval(interval);

        const google = (window as any).google;
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
        });

        google.accounts.id.renderButton(
          document.getElementById("googleSignInBtn"),
          { theme: "outline", size: "large", width: 240 }
        );

        google.accounts.id.prompt(); // optional auto-popup
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Send ID token to backend
      const res = await authApi.googleLogin(response.credential);

      if (res.success) {
       const user= localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(setUser(res.data));
        route.push("/client/profile");
      } else {
        toast.error(response.message);
      }

      // localStorage.setItem("token", res.data.token); // store JWT for SPA
    } catch (err) {
      console.error(err);
    }
  };

  return <div id="googleSignInBtn" className="flex justify-center"></div>;
}
