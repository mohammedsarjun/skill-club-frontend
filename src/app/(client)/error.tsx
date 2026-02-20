"use client";

import { useEffect } from "react";
import ErrorPlaceholder from "@/components/common/error/ErrorPlaceholder";

export default function ClientError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client Section Error:", error);
  }, [error]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 mt-8 border border-gray-100 min-h-[50vh] flex items-center justify-center">
      <ErrorPlaceholder 
        title="Something went wrong" 
        message="We encountered an issue while loading this page. Please try refreshing or going back to the dashboard."
        onRetry={() => reset()} 
      />
    </div>
  );
}
