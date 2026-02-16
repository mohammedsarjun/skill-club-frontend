"use client";

import { authApi } from "@/api/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import Button from "./Button";
import { LogOut, User } from "lucide-react";
import { clearSessionCookie } from "@/utils/session-cookie";

export default function AuthHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(clearUser());
      clearSessionCookie();
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleProfile = () => {
    if (user?.activeRole === 'freelancer') {
      router.push('/freelancer/profile');
    } else if (user?.activeRole === 'client') {
      router.push('/client/profile');
    } else if (user?.activeRole === 'admin') {
      router.push('/admin/profile');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Image
          src="/images/site logo.png"
          alt="Site Logo"
          width={150}
          height={50}
          className="object-contain cursor-pointer"
          onClick={() => router.push('/')}
        />

        <nav className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleProfile}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <User size={20} />
                <span className="font-medium">{user.firstName}</span>
              </button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
