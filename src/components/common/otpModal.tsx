import { authApi } from "@/api/authApi";
import { useState, useRef, useEffect } from "react";

interface OtpModalProps {
  onClose: () => void;
  onSubmit: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  initialTime?: number;
}

export default function OtpModal({
  onClose,
  onSubmit,
  onResend,
  initialTime = 300,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const expiry = sessionStorage.getItem("otpExpiry") as string;
  const expiryTime = new Date(expiry).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
  const [timeLeft, setTimeLeft] = useState(diff);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setErrors("Please enter all 4 digits");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(otpString);
    } catch (error) {
      setErrors(error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || loading) return;

    setLoading(true);
    try {
      await onResend();
      const resendResponse = await authApi.resendChangeEmailOtp();
      sessionStorage.setItem("otpExpiry", resendResponse.data.expiresAt);
      const expiry=resendResponse.data.expiresAt
      const expiryTime = new Date(expiry).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(diff);
      setOtp(Array(4).fill(""));
      setErrors("");
    } catch (error) {
      setErrors(
        error instanceof Error ? error.message : "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
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
                  inputRefs.current[index] = el;
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

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={timeLeft === 0}
            className={`mx-auto px-8 py-3 text-lg rounded-md text-white transition-colors ${
              timeLeft === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Submit Otp
          </button>

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
