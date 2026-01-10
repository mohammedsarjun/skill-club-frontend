"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Checkbox from "@/components/common/CheckBox";
import Image from "next/image";
import AuthGuard from "@/components/ClientAuthGaurd";
import { emailSchema, passwordSchema } from "@/utils/validations/validation";
import { z } from "zod";
import { authApi } from "@/api/authApi";
import { LoginData } from "@/api/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { adminAuthApi } from "@/api/adminAuthApi";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const dispatch = useDispatch();
  const route = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove error as user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email & password using Zod
    const emailResult = emailSchema.safeParse(formData.email);
    const passwordResult = passwordSchema.safeParse(formData.password);

    const newErrors: typeof errors = {};
    if (!emailResult.success)
      newErrors.email = emailResult.error.issues[0].message;
    if (!passwordResult.success)
      newErrors.password = passwordResult.error.issues[0].message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call

    const response = await adminAuthApi.login(formData);

    if (response.success) {
      dispatch(setUser(response.data));
      localStorage.setItem("user", JSON.stringify(response.data));
      route.replace("/admin/categories-skills");
    } else {
      toast.error(response.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/images/site logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="leading-8"
        />
        <h2 className="text-2xl font-bold ml-3">Welcome Back Admin</h2>
      </div>

      <div className="signUp bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              placeholder="Email"
              className="leading-5"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Password"
              className="leading-5"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              content={isLoading ? "Loading..." : "LOGIN"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return <LoginPage></LoginPage>;
}
