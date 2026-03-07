"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Checkbox from "@/components/common/CheckBox";
import Image from "next/image";
import { SignUpData } from "@/api/authApi";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/authApi";
import { handleSignUpSubmit } from "@/utils/validations/validation";
import { handleCheckBox } from "@/utils/formHandlers";
import toast from "react-hot-toast";
import GoogleLogin from "@/components/GoogleButton";

// ─── Types ───────────────────────────────────────────────────
type SignUpErrors = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreement: string | boolean;
};

// ─── Component ───────────────────────────────────────────────
function SignupPage() {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    agreement: false,
  });

  // confirmPassword is local-only — never sent to the API
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<SignUpErrors>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreement: "",
  });

  // ── Helpers ──────────────────────────────────────────────
  /** Update formData and clear that field's error */
  const handleField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** Validate email on blur */
  const handleEmailBlur = () => {
    import("@/utils/validations/validation").then(({ emailSchema }) => {
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
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    });
  };

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = handleSignUpSubmit(
        e,
        formData,
        setErrors as React.Dispatch<
          React.SetStateAction<Record<string, string | boolean>>
        >,
        confirmPassword
      );

      if (!isValid) {
        setIsLoading(false);
        return;
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const response = await authApi.signUp(formData, {
        timezone,
        country: data.country_code,
      });

      if (!response?.success) {
        toast.error(response?.message);
        setIsLoading(false);
        return;
      }

      const otpResponse = await authApi.createOtp(
        response.data.email,
        response.data.id,
        "signup"
      );

      if (!otpResponse.success) {
        toast.error(otpResponse.message);
        setIsLoading(false);
        return;
      }

      route.push("/otp");
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/site logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="leading-8"
          />
          <h2 className="text-2xl font-bold ml-3">Sign up</h2>
        </div>

        <div className="signUp bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6 relative">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}

          <GoogleLogin />

          <div className="flex items-center text-gray-400">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form className="space-y-4">
            {/* ── First / Last Name ── */}
            <div className="flex gap-4">
              <Input
                name="firstName"
                type="text"
                fullWidth={true}
                placeholder="First Name"
                className="leading-5"
                onChange={handleField}
                error={errors.firstName}
              />
              <Input
                name="lastName"
                type="text"
                fullWidth={true}
                placeholder="Last Name"
                className="leading-5"
                onChange={handleField}
                error={errors.lastName}
              />
            </div>

            {/* ── Email ── */}
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                className="leading-5"
                onChange={handleField}
                onBlur={handleEmailBlur}
                error={errors.email}
              />
              {errors.email && (
                <p className="text-xs text-gray-400 mt-0.5 ml-0.5">
                  Example:{" "}
                  <span className="font-medium text-gray-500">
                    john.doe@example.com
                  </span>
                </p>
              )}
            </div>

            {/* ── Phone ── */}
            <Input
              name="phone"
              type="number"
              placeholder="Phone"
              className="leading-5"
              onChange={handleField}
              error={errors.phone}
            />

            {/* ── Password (Input has built-in Eye toggle) ── */}
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                className="leading-5"
                onChange={(e) => {
                  handleField(e);
                  // Also clear confirmPassword match error when password changes
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                error={errors.password}
              />
              {!errors.password && (
                <p className="text-xs text-gray-400 mt-0.5 ml-0.5">
                  Min 8 chars · uppercase · lowercase · number · special character
                </p>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="leading-5"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                error={errors.confirmPassword}
              />
              {/* Live match indicator (only shown when there's no hard error) */}
              {confirmPassword.length > 0 && !errors.confirmPassword && (
                <p
                  className={`text-xs mt-0.5 ml-0.5 flex items-center gap-1 ${confirmPassword === formData.password
                      ? "text-green-500"
                      : "text-orange-400"
                    }`}
                >
                  {confirmPassword === formData.password ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Passwords match
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V10a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Passwords do not match yet
                    </>
                  )}
                </p>
              )}
            </div>

            {/* ── Agreement ── */}
            <Checkbox
              checked={formData.agreement as boolean}
              name="agreement"
              error={errors.agreement}
              onChange={(e) =>
                handleCheckBox("agreement", e, setFormData, setErrors)
              }
              label={
                <span>
                  I agree to the Skill Club{" "}
                  <span
                    onClick={() => route.push("/terms")}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    User Agreement
                  </span>{" "}
                  and{" "}
                  <span
                    onClick={() => route.push("/privacy")}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </span>
                </span>
              }
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                content="JOIN SKILL CLUB"
                onClick={(e) => handleSubmit(e)}
                disabled={isLoading}
              />
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an Account?{" "}
            <span
              className="text-blue-700 cursor-pointer"
              onClick={() => route.push("/login")}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default function Signup() {
  return <SignupPage />;
}
