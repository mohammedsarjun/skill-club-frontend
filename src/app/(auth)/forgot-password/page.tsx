"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Image from "next/image";
import { emailSchema } from "@/utils/validations/validation";
import { authApi } from "@/api/authApi"; // make sure you have forgotPassword API
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setError(emailResult.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword(email);

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
        <h2 className="text-2xl font-bold ml-3">Forgot Password</h2>
        <p className="text-gray-500 mt-2 text-center">
          Enter your email to receive a password reset link.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              placeholder="Email"
              className="leading-5"
              name="email"
              value={email}
              onChange={handleChange}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-center">
            <Button type="submit" content={isLoading ? "Sending..." : "Send Reset Link"} />
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

export default ForgotPasswordPage;
