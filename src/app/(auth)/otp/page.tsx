"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/common/Button";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { userApi } from "@/api/userApi";
import { setSessionCookie, buildSessionData } from "@/utils/session-cookie";

function OtpPage() {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // loader state
  const route = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [triggerTimer, setTriggerTimer] = useState<number>(0); // trigger effect when resend
  const dispatch = useDispatch();
  // Timer effect
  useEffect(() => {
    const expiry = sessionStorage.getItem("otpExpiry");
    if (!expiry) return;

    const expiryTime = new Date(expiry).getTime();
    let timer: ReturnType<typeof setTimeout>;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) clearInterval(timer);
    };

    updateCountdown();
    timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [triggerTimer]); // re-run when resend happens

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setErrors("");

      if (value && index < 3) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    if (otp.some((digit) => digit === "")) {
      setErrors("Please enter all 4 digits of the OTP.");
      return;
    }

    const otpValue = otp.join("");
    const email = sessionStorage.getItem("otpEmail");
    const userId = sessionStorage.getItem("userId");

    const response = await authApi.verifyOtp(email!, otpValue, userId!);

    try {
      if (!response.success) {
        return toast.error(response.message);
      }

      toast.success(response.message);

      const { purpose } = response.data;

      if (purpose === "signup") {
        const hydrateStateResponse = await userApi.me();

        if (!hydrateStateResponse.success) {
          return toast.error(hydrateStateResponse.message);
        }

        localStorage.setItem("user", JSON.stringify(hydrateStateResponse.data));
        dispatch(setUser(hydrateStateResponse.data));
        setSessionCookie(buildSessionData(hydrateStateResponse.data));
        route.replace("/onboarding/role");
      } else if (purpose === "forgotPassword") {
        route.push("/auth/change-password");
      }
    } catch (error: unknown) {
      console.error("An error occurred:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;

    setLoading(true);
    try {
      const email = sessionStorage.getItem("otpEmail");
      const response = await authApi.createOtp(email!, undefined, "signup"); // purpose dynamic if needed

      if (response.success) {
        toast.success(response.message);

        // restart timer
        setTriggerTimer((prev) => prev + 1);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex items-center justify-center relative">
        <div className="signUp bg-white p-12 rounded-xl shadow-xl w-120 max-w-full h-auto space-y-6 text-center relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          <h2 className="font-bold text-2xl">
            Enter <span className="text-blue-600">Otp</span> Below
          </h2>

          <p className="text-gray-600 font-medium">Enter Otp:</p>
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputRefs.current[index] = el!;
                }}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={timeLeft === 0}
                className={`w-12 h-12 text-center text-lg font-bold border rounded-md ${
                  errors && digit === "" ? "border-red-500" : "border-gray-300"
                } ${timeLeft === 0 ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
            ))}
          </div>
          {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}

          {timeLeft > 0 ? (
            <p className="text-gray-500 text-sm">
              OTP expires in:{" "}
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p style={{ color: "red" }}>OTP expired. Please resend.</p>
          )}

          <Button
            content="Submit Otp"
            type="submit"
            onClick={handleSubmit}
            disabled={timeLeft === 0}
            className={`mx-auto px-8 py-3 text-lg rounded-md text-white transition-colors ${
              timeLeft === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-600-dark"
            }`}
          />

          <p className="text-gray-500 text-sm mt-2">Didn't receive the Otp?</p>
          <p
            className={`text-blue-600 font-semibold cursor-pointer hover:underline ${
              timeLeft > 0 || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleResend}
          >
            Resend Otp
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Otp() {
  return <OtpPage />;
}
