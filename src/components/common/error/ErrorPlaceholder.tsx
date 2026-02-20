import React from "react";
import Button from "../Button";
import { MoveLeft, RotateCcw, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ErrorPlaceholderProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
  statusCode?: number | string;
}

export default function ErrorPlaceholder({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again or go back to home.",
  onRetry,
  showHome = true,
  statusCode,
}: ErrorPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse" />
        <div className="relative bg-white p-6 rounded-full shadow-xl">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        {statusCode && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {statusCode}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 max-w-md mb-8">{message}</p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {onRetry && (
          <Button onClick={onRetry} variant="primary" className="flex items-center gap-2">
            <RotateCcw size={18} />
            Try Again
          </Button>
        )}
        
        {showHome && (
          <Link href="/">
            <Button variant="secondary" className="flex items-center gap-2">
              <MoveLeft size={18} />
              Back to Home
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-12 text-gray-400 text-sm">
        If the problem persists, please contact our support team.
      </div>
    </div>
  );
}
