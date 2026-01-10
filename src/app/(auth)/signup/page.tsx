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
import { handleInputChange, handleCheckBox } from "@/utils/formHandlers";
import toast from "react-hot-toast";

import GoogleLogin from "@/components/GoogleButton";
import countryToCurrency, { getCurrency } from "@/utils/countryToCurrency";

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

  const [errors, setErrors] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    agreement: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = handleSignUpSubmit(e, formData, setErrors);
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const response = await authApi.signUp(formData,{timezone, country: data.country_code});
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

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

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

        {/* Signup Card */}
        <div className="signUp bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6 relative">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Google signup */}
          <GoogleLogin></GoogleLogin>

          {/* Separator */}
          <div className="flex items-center text-gray-400">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Input fields */}
          <form className="space-y-4">
            <div className="flex gap-4">
              <Input
                name="firstName"
                type="text"
                fullWidth={true}
                placeholder="First Name"
                className="leading-5"
                onChange={(e) => handleInputChange(e, setErrors, setFormData)}
                error={errors.firstName}
              />
              <Input
                name="lastName"
                type="text"
                fullWidth={true}
                placeholder="Last Name"
                className="leading-5"
                onChange={(e) => handleInputChange(e, setErrors, setFormData)}
                error={errors.lastName}
              />
            </div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="leading-5"
              onChange={(e) => handleInputChange(e, setErrors, setFormData)}
              error={errors.email}
            />

            <Input
              name="phone"
              type="number"
              placeholder="Phone"
              className="leading-5"
              onChange={(e) => handleInputChange(e, setErrors, setFormData)}
              error={errors.phone}
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="leading-5"
              onChange={(e) => handleInputChange(e, setErrors, setFormData)}
              error={errors.password}
            />

            <Checkbox
              checked={formData.agreement}
              name="agreement"
              error={errors.agreement}
              onChange={(e) =>
                handleCheckBox("agreement", e, setFormData, setErrors)
              }
              label={
                <span>
                  I agree to the Skill Club{" "}
                  <a
                    href="/user-agreement"
                    className="text-blue-600 hover:underline"
                  >
                    User Agreement
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
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

// Wrap with AuthGuard
export default function Signup() {
  return <SignupPage />;
}
