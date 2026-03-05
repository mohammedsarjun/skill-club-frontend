"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Image from "next/image";
import { emailSchema, passwordSchema } from "@/utils/validations/validation";
import { authApi } from "@/api/authApi";
import { LoginData } from "@/api/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import GoogleLogin from "@/components/GoogleButton";
import { setSessionCookie, buildSessionData } from "@/utils/session-cookie";
import { getAuthRedirectPath } from "@/utils/auth-redirect";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const dispatch = useDispatch();
  const route = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error as user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate email when the field loses focus (on blur)
  const handleEmailBlur = () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    const result = emailSchema.safeParse(formData.email.trim());
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        email: result.error.issues[0].message,
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Full validation on submit
    const emailResult = emailSchema.safeParse(formData.email.trim());
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

    const response = await authApi.login(formData);

    if (response.success) {
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(setUser(response.data));
      setSessionCookie(buildSessionData(response.data));
      const redirectPath = getAuthRedirectPath(response.data);
      route.replace(redirectPath);
    } else {
      toast.error(response.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
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
        <h2 className="text-2xl font-bold ml-3">Welcome Back</h2>
      </div>

      <div className="signUp bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <GoogleLogin></GoogleLogin>
        <div className="flex items-center text-gray-400">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ── Email ── */}
          <div>
            <Input
              placeholder="Email"
              className="leading-5"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
            />
            {errors.email && (
              <div className="mt-1.5 flex items-start gap-1.5">
                {/* error icon */}
                <svg
                  className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-red-600 text-sm font-medium">{errors.email}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Example:{" "}
                    <span className="font-medium text-gray-500">
                      john.doe@example.com
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Password (Input has built-in show/hide via Eye icon) ── */}
          <div>
            <Input
              placeholder="Password"
              className="leading-5"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="mt-1.5 flex items-start gap-1.5">
                <svg
                  className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-600 text-sm font-medium">{errors.password}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Remember me</span>
            </label>
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot password?
            </a>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              content={isLoading ? "Loading..." : "LOGIN"}
            />
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an Account?{" "}
          <span
            className="text-blue-700 cursor-pointer"
            onClick={() => route.push("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return <LoginPage />;
}
