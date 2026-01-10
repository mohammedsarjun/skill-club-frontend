"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Image from "next/image";
import { passwordSchema } from "@/utils/validations/validation"; // make sure you have a password schema
import { authApi } from "@/api/authApi"; // make sure you have resetPassword API
import toast from "react-hot-toast";

function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Assuming you pass reset token as query param

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleChangeConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.issues[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      toast.error("Invalid or expired link.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resetPassword({ token, password });

      if (response.success) {
        toast.success(response.message);
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/images/site logo.png"
          alt="Logo"
          width={200}
          height={200}
        />
        <h2 className="text-2xl font-bold ml-3">Change Password</h2>
        <p className="text-gray-500 mt-2 text-center">
          Enter your new password below.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              type="password"
              placeholder="New Password"
              className="leading-5"
              name="password"
              value={password}
              onChange={handleChangePassword}
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              className="leading-5"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChangeConfirm}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-center">
            <Button type="submit" content={isLoading ? "Saving..." : "Change Password"} />
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{" "}
          <span className="text-blue-700 cursor-pointer" onClick={() => router.push("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
