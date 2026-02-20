"use client";

import { useEffect } from "react";
import ErrorPlaceholder from "@/components/common/error/ErrorPlaceholder";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Section Error:", error);
  }, [error]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-12 mt-4 transition-all duration-300 border border-gray-100">
      <ErrorPlaceholder 
        title="Admin Dashboard Error" 
        message="We encountered an issue while loading this section of the admin dashboard."
        onRetry={() => reset()} 
        showHome={false}
      />
    </div>
  );
}
